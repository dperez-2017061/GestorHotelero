'use strict'

const Room = require('../models/room.model');
const Hotel = require('../models/hotel.model');
const { validateData, checkPermission } = require('../utils/validate');

//FUNCIONES PARA ADMINISTRADOR DE LA APLICACIÓN

exports.addRoom = async(req,res)=>{
    try{
        let params = req.body;
        let data = {
            NoRoom: params.NoRoom,
            description: params.description,
            services: params.services.replace(/\s+/g, ''),
            type: params.type,
            status: 'available',
            price: params.price,
            hotel: params.hotel
        }

        let msg = validateData(data);
        if(msg) return res.status(400).send(msg);
        let hotelExist = await Hotel.findOne({_id: data.hotel});
        if(!hotelExist) return res.status(400).send({message: 'Hotel not found'});
        
        if(data.services.includes(',')){
            let services=[];
            data.services = data.services.split(',');
            for(let service of data.services){
                services.push({service:service});
            }
            data.services = services;
        }else{
            data.services = [{service:data.services}];
        }
        
        let room = new Room(data);
        await room.save();
        return res.send({message: 'Room created successfully'});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error creating room'}) ;
    }
};

//FUNCIONES PARA CLIENTE

exports.getRooms = async(req,res)=>{
    try{
        let rooms = await Room.find({hotel: req.params.id}).lean().populate('hotel');

        return res.send({rooms});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error getting rooms'}) ;
    }
}

//FUNCIONES PARA ADMINISTRADOR DEL HOTEL

exports.availableRooms = async(req,res)=>{
    try{
        let rooms = await Room.find({hotel: req.params.id, status: 'available'}).lean().populate('hotel');

        return res.send({availableRooms: rooms.length});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error getting available rooms'}) ;
    }
}