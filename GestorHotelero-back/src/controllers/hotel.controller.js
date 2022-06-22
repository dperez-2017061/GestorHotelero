'use strict'

const Hotel = require('../models/hotel.model');
const { validateData, deleteSensitiveData } = require('../utils/validate');

//FUNCIONES PARA ADMINISTRADOR DE LA APLICACIÓN

exports.createHotel = async (req,res)=>{
    try{
        let params = req.body;
        let data={
            name: params.name,
            address: params.address,
            description: params.description,
            /* typeRooms: params.typeRooms.replace(/\s+/g, ''),
            priceRooms: params.priceRooms.replace(/\s+/g, ''), */
            administrator: params.administrator
        }

        let msg =  validateData(data);
        if(msg) return res.status(400).send(msg);
        let nameExist = await Hotel.findOne({name: data.name});
        if(nameExist) return res.status(400).send({message: `Hotel ${data.name} already exist`});
        let addressExist = await Hotel.findOne({address: data.address});
        if(addressExist) return res.status(400).send({message: `Hotel whit address: ${data.address} already exist`});
        let adminExist = await Hotel.findOne({administrator: data.administrator}).lean().populate('administrator');
        if(adminExist) return res.status(400).send({message: `Hotel whit administrator: ${adminExist.administrator.name} already exist`});
        /* data.typeRooms = data.typeRooms.split(',');
        data.priceRooms = data.priceRooms.split(',');
        data.roomRates=[];
        for (let i=0; i<data.typeRooms.length;i++){
            let rooms = {
                name: data.typeRooms[i],
                price:data.priceRooms[i]
            };
            data.roomRates.push(rooms);
        }
    
        delete data.typeRooms;
        delete data.priceRooms; */

        let hotel = new Hotel(data);
        await hotel.save();
        return res.send({message: 'Hotel created successfully'});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error creating hotel'}) ;
    }
};

//FUNCIONES PARA CLIENTE

exports.getHotel = async(req,res)=>{
    try{
        let hotelId = req.params.idH;

        let hotel = await Hotel.findOne({_id: hotelId}).lean().populate('administrator');
        if(!hotel) return res.status(400).send({message: 'Hotel not found'})
        deleteSensitiveData(hotel);
        
        return res.send({hotel});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error getting hotels'}) ;
    }
}


//FUNCIONES PÚBLICAS

exports.getHotels = async(req,res)=>{
    try{
        let hotels = await Hotel.find().lean().populate('administrator');

        for(let hotel of hotels){
            await deleteSensitiveData(hotel);
        };
        return res.send({hotels});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error getting hotels'}) ;
    }
}

exports.searchHotelByName = async(req,res)=>{
    try{
        let params = req.body;
        let data = {name: params.name};
        
        let msg = validateData(data);
        if(msg) return res.status(400).send(msg);
        let hotels = await Hotel.find({name: {$regex: params.name, $options: 'i'}}).lean().populate('administrator');
        for(let hotel of hotels){
            await deleteSensitiveData(hotel);
        };
        return res.send({hotels});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error searching hotels'});
    }
};

exports.searchHotelByAddress = async(req,res)=>{
    try{
        let params = req.body;
        let data = {address: params.address};
        
        let msg = validateData(data);
        if(msg) return res.status(400).send(msg);
        let hotels = await Hotel.find({address: {$regex: params.address, $options: 'i'}}).lean().populate('administrator');
        for(let hotel of hotels){
            await deleteSensitiveData(hotel);
        };
        return res.send({hotels});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error searching hotels'});
    }
};