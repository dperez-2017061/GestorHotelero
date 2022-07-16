'use strict'

const Reservation = require('../models/reservation.model');
const moment = require('moment');
const Room = require('../models/room.model');
const Hotel = require('../models/hotel.model');
const User = require('../models/user.model');
const { validateData, deleteSensitiveData, checkParams, checkUpdate } = require('../utils/validate');

//FUNCIONES PARA CLIENTE

exports.makeReservation = async(req,res)=>{
    try{
        let params = req.body;
        let data = {
            user: req.user.sub,
            startDate: params.startDate,
            finishDate: params.finishDate,
            status: 'APPROVED',
            room: params.room
        }

        let msg =  validateData(data);
        if(msg) return res.status(400).send(msg);
        let roomExist = await Room.findOne({_id: data.room});
        if(!roomExist) return res.status(400).send({message: 'Room not found'});
        let dateStart = moment(data.startDate + 'Z').unix();
        let dateFinish = moment(data.finishDate + 'Z').unix();
        if(dateStart >= dateFinish || moment(data.startDate).unix() < moment().unix()) return res.status(400).send({message: 'Equal dates or invalid start date'});

        let validation = await Reservation.find({room: data.room});
        let now = new Date(moment().format('YYYY-MM-DDTHH:mm:ss')+'Z').getTime();

        for(let reservation of validation){
            if(reservation.finishDate.getTime() <= now){
                await Reservation.findOneAndUpdate({_id: reservation._id},{status: 'FINISHED'});
                await Room.findByIdAndUpdate({_id: reservation.room},{available: true});
                await User.findOneAndUpdate({_id: reservation.user},{hotel: null});
            }else if(reservation.startDate.getTime() <= now && 
                now < reservation.finishDate.getTime()){
                await Reservation.findOneAndUpdate({_id: reservation._id},{status: 'ACTIVE'});
                await User.findOneAndUpdate({_id: reservation.user},{hotel: reservation.hotel});
            }
        }

        let reservations = await Reservation.find({$or:[
            {room: data.room, status: 'APPROVED'},
            {room: data.room, status: 'ACTIVE'},
        ]});

        for(let reservation of reservations){
            let finishReservation = moment(reservation.finishDate).unix();
            let startReservation = moment(reservation.startDate).unix();
            if(
                startReservation == dateStart ||
                finishReservation == dateFinish
            ){
                return res.status(400).send({message: 'This room was reservating in this days'});
            }else if(startReservation > dateStart && startReservation < dateFinish){
                return res.status(400).send({message: 'This room was reservating in this days'});
            }else if(startReservation < dateStart && finishReservation > dateStart){
                return res.status(400).send({message: 'This room was reservating in this days'});
            }else if(finishReservation > dateFinish && startReservation < dateFinish){
                return res.status(400).send({message: 'This room was reservating in this days'});
            }else if(finishReservation < dateFinish && finishReservation > dateStart){
                return res.status(400).send({message: 'This room was reservating in this days'});
            }
        }
        let days = moment(data.finishDate).diff(moment(data.startDate), 'days');
        if(days == 0){
            days = 1
        }
        data.total = roomExist.price*days;
        data.hotel = roomExist.hotel;
        data.startDate = data.startDate + 'Z';
        data.finishDate = data.finishDate + 'Z';

        let reservation = new Reservation(data);
        await reservation.save();

        await Room.findOneAndUpdate({room: data.room},{available: false});

        return res.send({message: 'Reservation created successfully'});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error making reservation'});
    }
};

exports.getReservationsApproved = async(req,res)=>{
    try{
        let validation = await Reservation.find({user: req.user.sub});
        let now = new Date(moment().format('YYYY-MM-DDTHH:mm:ss')+'Z').getTime();

        for(let reservation of validation){
            if(reservation.finishDate.getTime() <= now){
                await Reservation.findOneAndUpdate({_id: reservation._id},{status: 'FINISHED'});
                await Room.findByIdAndUpdate({_id: reservation.room},{available: true});
                await User.findOneAndUpdate({_id: reservation.user},{hotel: null});
            }else if(reservation.startDate.getTime() <= now && 
                now < reservation.finishDate.getTime()){
                await Reservation.findOneAndUpdate({_id: reservation._id},{status: 'ACTIVE'});
                await User.findOneAndUpdate({_id: reservation.user},{hotel: reservation.hotel});
            }
        }
        let reservations = await Reservation.find({$or:[
            {user: req.user.sub, status: 'APPROVED'},
            {user: req.user.sub, status: 'ACTIVE'},
        ]})
        .lean()
        .populate('user')
        .populate('hotel')
        .populate('room');
        for(let reservation of reservations){
            await deleteSensitiveData(reservation);
        }
        reservations.sort((a,b) => a.startDate - b.startDate);

        return res.send({reservations});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error getting reservations'});
    }
};

exports.getReservationsFinished = async(req,res)=>{
    try{
        let validation = await Reservation.find({user: req.user.sub});
        let now = new Date(moment().format('YYYY-MM-DDTHH:mm:ss')+'Z').getTime();

        for(let reservation of validation){
            if(reservation.finishDate.getTime() <= now){
                await Reservation.findOneAndUpdate({_id: reservation._id},{status: 'FINISHED'});
                await Room.findByIdAndUpdate({_id: reservation.room},{available: true});
                await User.findOneAndUpdate({_id: reservation.user},{hotel: null});
            }else if(reservation.startDate.getTime() <= now && 
                now < reservation.finishDate.getTime()){
                await Reservation.findOneAndUpdate({_id: reservation._id},{status: 'ACTIVE'});
                await User.findOneAndUpdate({_id: reservation.user},{hotel: reservation.hotel});
            }
        }
        let reservations = await Reservation.find({$or:[
            {user: req.user.sub, status: 'FINISHED'},
            {user: req.user.sub, status: 'CANCELED'},
        ]})
        .lean()
        .populate('user')
        .populate('hotel')
        .populate('room');
        for(let reservation of reservations){
            await deleteSensitiveData(reservation);
        }
        reservations.sort((a,b) => a.startDate - b.startDate);

        return res.send({reservations});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error getting reservations'});
    }
};

exports.getReservationsC = async(req,res)=>{
    try{
        let hotelId = req.params.idH;

        let hotel = await Hotel.findOne({_id: hotelId});
        if(!hotel) return res.status(400).send({message: 'Hotel not found'});
        let validation = await Reservation.find({hotel: hotelId});
        let now = new Date(moment().format('YYYY-MM-DDTHH:mm:ss')+'Z').getTime();

        for(let reservation of validation){
            if(reservation.finishDate.getTime() <= now){
                await Reservation.findOneAndUpdate({_id: reservation._id},{status: 'FINISHED'});
                await Room.findByIdAndUpdate({_id: reservation.room},{available: true});
                await User.findOneAndUpdate({_id: reservation.user},{hotel: null});
            }else if(reservation.startDate.getTime() <= now && 
                now < reservation.finishDate.getTime()){
                await Reservation.findOneAndUpdate({_id: reservation._id},{status: 'ACTIVE'});
                await User.findOneAndUpdate({_id: reservation.user},{hotel: reservation.hotel});
            }
        }
        let reservations = await Reservation.find({$or:[
            {hotel: hotelId, status: 'APRROVED'},
            {hotel: hotelId, status: 'ACTIVE'}
        ]})
        .lean()
        .populate('user')
        .populate('hotel')
        .populate('room');
        for(let reservation of reservations){
            await deleteSensitiveData(reservation);
        }
        reservations.sort((a,b) => a.startDate - b.startDate);
        return res.send({reservations});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error getting reservations'});
    }
};

exports.cancelReservation = async(req,res)=>{
    try{
        let reservationId = req.params.idR;

        let reservationExist = await Reservation.findOne({_id: reservationId});
        if(!reservationExist) return res.status(400).send({message: 'Reservation not found'});
        let now = new Date(moment().format('YYYY-MM-DDTHH:mm:ss')+'Z').getTime();
        if(reservationExist.finishDate.getTime() <= now){
            await Reservation.findOneAndUpdate({_id: reservationExist._id},{status: 'FINISHED'});
            await Room.findByIdAndUpdate({_id: reservationExist.room},{available: true});
            await User.findOneAndUpdate({_id: reservationExist.user},{hotel: null});
        }else if(reservationExist.startDate.getTime() <= now && 
            now < reservationExist.finishDate.getTime()){
                await Reservation.findOneAndUpdate({_id: reservationExist._id},{status: 'ACTIVE'});
                await User.findOneAndUpdate({_id: reservationExist.user},{hotel: reservationExist.hotel});
        }

        if(reservationExist.status != 'APPROVED') return res.send({message: 'Cannot cancel reservation that already finisihed or already canceled'})
        await Reservation.findOneAndUpdate({_id: reservationId},{status: 'CANCELED'});
        await Room.findOneAndUpdate({_id: reservationExist.room},{available: true});

        return res.send({message: 'Reservation canceled'});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error making reservation'});
    }
};

//FUNCIONES PARA ADMINHOTEL

exports.getReservation = async(req,res)=>{
    try{
        let reservationId = req.params.idR;
        
        let reservationExist = await Reservation.findOne({_id: reservationId})
        .lean()
        .populate('user')
        .populate('hotel')
        .populate('room');
        if(!reservationExist) return res.status(500).send({message: 'Reservation not found'});
        let hotel = await Hotel.findOne({administrator: req.user.sub});
        if(!hotel) return res.status(400).send({message: 'Has not been assigned a hotel'});
        let now = new Date(moment().format('YYYY-MM-DDTHH:mm:ss')+'Z').getTime();
        if(reservationExist.finishDate.getTime() <= now){
            await Reservation.findOneAndUpdate({_id: reservationExist._id},{status: 'FINISHED'});
            await Room.findByIdAndUpdate({_id: reservationExist.room._id},{available: true});
            await User.findOneAndUpdate({_id: reservationExist.user},{hotel: null});
        }else if(reservationExist.startDate.getTime() <= now &&
            now < reservationExist.finishDate.getTime()){
            await Reservation.findOneAndUpdate({_id: reservationExist._id},{status: 'ACTIVE'});
            await User.findOneAndUpdate({_id: reservationExist.user},{hotel: reservationExist.hotel});
        }
        await deleteSensitiveData(reservationExist);

        return res.send({reservation: reservationExist});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error getting reservation'});
    }
};

exports.getReservations = async(req,res)=>{
    try{
        let hotel = await Hotel.findOne({administrator: req.user.sub});
        if(!hotel) return res.status(400).send({message: 'Has not been assigned a hotel'});
        let validation = await Reservation.find({hotel: hotel._id});
        let now = new Date(moment().format('YYYY-MM-DDTHH:mm:ss')+'Z').getTime();
        for(let reservation of validation){
            if(reservation.finishDate.getTime() <= now){
                await Reservation.findOneAndUpdate({_id: reservation._id},{status: 'FINISHED'});
                await Room.findByIdAndUpdate({_id: reservation.room},{available: true});
                await User.findOneAndUpdate({_id: reservation.user},{hotel: null});
            }else if(reservation.startDate.getTime() <= now && 
            now < reservation.finishDate.getTime()){
                await Reservation.findOneAndUpdate({_id: reservation._id},{status: 'ACTIVE'});
                await User.findOneAndUpdate({_id: reservation.user},{hotel: reservation.hotel});
            }
        }
        let reservations = await Reservation.find({hotel: hotel._id})
        .lean()
        .populate('user')
        .populate('hotel')
        .populate('room');
        for(let reservation of reservations){
            await deleteSensitiveData(reservation);
        }
        reservations.sort((a,b) => a.startDate - b.startDate);

        return res.send({reservations});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error getting reservations'});
    }
};


exports.updateReservation = async(req,res)=>{
    try{
        let reservationId = req.params.idR;
        let params = req.body;

        let reservationExist = await Reservation.findOne({_id: reservationId});
        if(!reservationExist) return res.status(400).send({message: 'Reservation not found'});
        let roomExist = await Room.findOne({_id: reservationExist.room});
        if(!roomExist) return res.status(400).send({message: 'Room not found'});
        let hotel = await Hotel.findOne({administrator: req.user.sub});
        if(String(hotel._id) != String(reservationExist.hotel)) return res.status(403).send({message: 'Not are the administrator of this hotel'})
        let emptyParams = await checkParams(params);
        if(emptyParams === false) return res.status(400).send({message: 'Empty params'});
        let validateUpdate = await checkUpdate(params);
        if(validateUpdate === false) return res.status(400).send({message: 'Cannot update this information'});
        let now = new Date(moment().format('YYYY-MM-DDTHH:mm:ss')+'Z').getTime();

        if(reservationExist.finishDate.getTime() <= now){
            await Reservation.findOneAndUpdate({_id: reservationExist._id},{status: 'FINISHED'});
            await Room.findByIdAndUpdate({_id: reservationExist.room},{available: true});
            await User.findOneAndUpdate({_id: reservationExist.user},{hotel: null});
        }else if(reservationExist.startDate.getTime() <= now && 
            now < reservationExist.finishDate.getTime()){
                await Reservation.findOneAndUpdate({_id: reservationExist._id},{status: 'ACTIVE'});
                await User.findOneAndUpdate({_id: reservationExist.user},{hotel: reservationExist.hotel});
        }
        
        let dateStart = moment(params.startDate + 'Z').unix();
        let dateFinish = moment(params.finishDate + 'Z').unix();
        if((dateStart != moment(reservationExist.startDate).unix() && dateStart >= dateFinish) ||
            (dateFinish != moment(reservationExist.finishDate).unix() && moment(params.finishDate).unix() < moment().unix()))
            return res.status(400).send({message: 'Equal dates or invalid start date'});
        if(reservationExist.status != 'APPROVED') return res.status(400).send({message: 'Cannot update reservations finished or actives'});
        if(dateStart != moment(reservationExist.startDate).unix() ||
            dateFinish != moment(reservationExist.finishDate).unix()){
            let reservations = await Reservation.find({$or:[
            {room: reservationExist.room, status: 'APPROVED'},
            {room: reservationExist.room, status: 'ACTIVE'}
        ]});
            for(let reservation of reservations){
                if(reservation._id == reservationId){}else{
                    let finishReservation = moment(reservation.finishDate).unix();
                    let startReservation = moment(reservation.startDate).unix();
                    if(
                        startReservation == dateStart ||
                        finishReservation == dateFinish
                    ){
                        return res.status(400).send({message: 'This room was reservating in this days'});
                    }else if(startReservation > dateStart && startReservation < dateFinish){
                        return res.status(400).send({message: 'This room was reservating in this days'});
                    }else if(startReservation < dateStart && finishReservation > dateStart){
                        return res.status(400).send({message: 'This room was reservating in this days'});
                    }else if(finishReservation > dateFinish && startReservation < dateFinish){
                        return res.status(400).send({message: 'This room was reservating in this days'});
                    }else if(finishReservation < dateFinish && finishReservation > dateStart){
                        return res.status(400).send({message: 'This room was reservating in this days'});
                    }
                }
            }
        }
        let days = moment(params.finishDate).diff(moment(params.startDate), 'days');
        if(days == 0){
            days = 1;
        }
        params.total = roomExist.price*days;
        params.startDate = params.startDate + 'Z';
        params.finishDate = params.finishDate + 'Z';

        let reservationUpdate = await Reservation.findOneAndUpdate({_id: reservationId}, params,{new: true});
        return res.send({reservation: reservationUpdate, message: 'Reservation updated'})
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error updating reservation'})
    }
};

exports.deleteReservation = async(req,res)=>{
    try{
        let reservationId = req.params.idR;

        let reservationExist = await Reservation.findOne({_id: reservationId});
        if(!reservationExist) return res.status(400).send({message: 'Reservation not found'});
        let hotel = await Hotel.findOne({administrator: req.user.sub});
        if(String(hotel._id) != String(reservationExist.hotel)) return res.status(403).send({message: 'Not are the administrator of this hotel'});

        await Room.findOneAndUpdate({_id: reservationExist.room},{available: true});
        await Reservation.findOneAndDelete({_id: reservationId});

        return res.send({reservation: reservationExist, message: 'Reservation deleted'});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error deleting reservation'});
    }
}

//FUNCIONES PARA ADMINISTRADOR DE LA APLICACIÓN

exports.reservationsByHotel = async(req,res)=>{
    try{
        let hotels = await Hotel.find();
        let reservations = [];
        let validation = await Reservation.find({});
        let now = new Date(moment().format('YYYY-MM-DDTHH:mm:ss')+'Z').getTime();
        for(let reservation of validation){
            if(reservation.finishDate.getTime() <= now){
                await Reservation.findOneAndUpdate({_id: reservation._id},{status: 'FINISHED'});
                await Room.findByIdAndUpdate({_id: reservation.room},{available: true});
                await User.findOneAndUpdate({_id: reservation.user},{hotel: null});
            }else if(reservation.startDate.getTime() <= now && 
                now < reservation.finishDate.getTime()){
                await Reservation.findOneAndUpdate({_id: reservation._id},{status: 'ACTIVE'});
                await User.findOneAndUpdate({_id: reservation.user},{hotel: reservation.hotel});
            }
        };
        for(let hotel of hotels){
            
            let aprovedReservations = (await Reservation.find({or$:[
                {status: 'APPROVED',hotel:hotel._id},
                {status: 'ACTIVE',hotel:hotel._id},
            ]})).length;
            let finishedReservations = (await Reservation.find({status: 'FINISHED',hotel:hotel._id})).length;
            let canceledReservations = (await Reservation.find({status: 'CANCELED',hotel:hotel._id})).length;
            let totalReservations = (await Reservation.find({hotel:hotel._id})).length;
            reservations.push({hotel,aprovedReservations,finishedReservations,canceledReservations,totalReservations});
        }
        return res.send(reservations);
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error getting reservations'})
    }
};