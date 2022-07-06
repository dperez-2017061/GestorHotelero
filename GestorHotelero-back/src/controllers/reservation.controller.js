'use strict'

const Reservation = require('../models/reservation.model');
const moment = require('moment')
const Room = require('../models/room.model');
const Hotel = require('../models/hotel.model');
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
        data.startDate = new Date('2022/'+ params.startDate);
        data.finishDate = new Date('2022/'+ params.finishDate);
        let dateStart = moment(data.startDate).unix();
        let dateFinish = moment(data.finishDate).unix();
        if(dateStart >= dateFinish || dateStart < moment().unix()) return res.status(400).send({message: 'Equal dates or invalid start date'});

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
        
        data.hotel = roomExist.hotel;
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
        let reservations = await Reservation.find({user: req.user.sub, status: 'APPROVED'})
        .lean()
        .populate('user')
        .populate('hotel')
        .populate('room');
        for(let reservation of reservations){
            await deleteSensitiveData(reservation);
        }

        return res.send({reservations});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error getting reservations'});
    }
};

exports.getReservationsFinished = async(req,res)=>{
    try{
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

exports.getReservations = async(req,res)=>{
    try{
        let hotel = await Hotel.findOne({administrator: req.user.sub});
        if(!hotel) return res.status(400).send({message: 'Has not been assigned a hotel'});
        let reservations = await Reservation.find({hotel: hotel._id})
        .lean()
        .populate('user')
        .populate('hotel')
        .populate('room');
        for(let reservation of reservations){
            await deleteSensitiveData(reservation);
        }

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
        let hotel = await Hotel.findOne({administrator: req.user.sub});
        if(String(hotel._id) != String(reservationExist.hotel)) return res.status(403).send({message: 'Not are the administrator of this hotel'})
        let emptyParams = await checkParams(params);
        if(emptyParams === false) return res.status(400).send({message: 'Empty params'});
        let validateUpdate = await checkUpdate(params);
        if(validateUpdate === false) return res.status(400).send({message: 'Cannot update this information'});

        let dateStart = moment(params.startDate).unix();
        let dateFinish = moment(params.finishDate).unix();
        if(dateStart >= dateFinish || dateStart < moment().unix()) return res.status(400).send({message: 'Equal dates or invalid start date'});
        if(dateStart != moment(reservationExist.startDate).unix() ||
            dateFinish != moment(reservationExist.finishDate).unix()){

            let reservations = await Reservation.find({$or:[
            {room: reservationExist.room, status: 'APPROVED'},
            {room: reservationExist.room, status: 'ACTIVE'}
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
        }

        let reservationUpdate = await Reservation.findOneAndUpdate({_id: reservationId}, {params},{new: true});
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
}