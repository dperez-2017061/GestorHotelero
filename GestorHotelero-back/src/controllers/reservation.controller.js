'use strict'

const Reservation = require('../models/reservation.model');
const moment = require('moment')
const Room = require('../models/room.model');
const Hotel = require('../models/hotel.model');
const { validateData, deleteSensitiveData } = require('../utils/validate');

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

        let reservations = await Reservation.find({room: data.room});
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

        return res.send({message: 'Reservation created successfully'})
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error making reservation'});
    }
};

exports.cancelReservation = async(req,res)=>{
    try{
        let reservationId = req.params.idR;

        let reservationExist = await Reservation.findOne({_id: reservationId});
        if(!reservationExist) return res.status(400).send({message: 'Reservation not found'});
        await Reservation.findOneAndUpdate({_id: reservationId},{status: 'CANCELED'});
        await Room.findOneAndUpdate({_id: reservationExist.room},{available: true});

        return res.send({message: 'Reservation canceled'});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error making reservation'});
    }
}

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

//FUNCIONES PARA ADMINISTRADOR DE LA APLICACIÓN

exports.reservationsByHotel = async(req,res)=>{
    try{
        let hotels = await Hotel.find();
        let reservations = [];
        for(let hotel of hotels){
            let aprovedReservations = (await Reservation.find({status: 'APPROVED',hotel:hotel._id})).length;
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