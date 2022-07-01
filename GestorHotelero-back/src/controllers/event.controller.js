'use strict'

const moment = require('moment');
const Event = require('../models/event.model');
const User = require('../models/user.model');
const Hotel = require('../models/hotel.model');
const { validateData, deleteSensitiveData } = require('../utils/validate');

//FUNCIONES PARA ADMINHOTEL

exports.createEvent = async (req,res)=>{
    try{
        let params = req.body;
        let data ={
            user: params.user,
            name: params.name,
            type: params.type,
            startDate: params.startDate,
            finishDate: params.finishDate,
            finishDate: params.finishDate,
            services: params.services,
            prices: params.prices,
            cost: params.cost
        }

        let msg = validateData(data);
        if(msg) return res.status(400).send(msg);
        let userExist = await User.findOne({_id: data.user});
        if(!userExist) return res.status(400).send({message: 'User not found'});
        let hotel = await Hotel.findOne({administrator: req.user.sub});
        if(!hotel) return res.status(400).send({message: 'Has not been assigned a hotel'});
        data.hotel = hotel._id;

        let nameExist = await Event.findOne({name: data.name});
        if(nameExist) return res.status(400).send({message: `Event ${data.name} already exist`});
        data.startDate = new Date('2022/'+ params.startDate);
        data.finishDate = new Date('2022/'+ params.finishDate);
        let dateStart = moment(data.startDate).unix();
        let dateFinish = moment(data.finishDate).unix();
        if(dateStart >= dateFinish || dateStart < moment().unix()) return res.status(400).send({message: 'Equal dates or invalid start date'});

        let events = await Event.find({hotel: data.hotel});
        for(let event of events){
            let finishReservation = moment(event.finishDate).unix();
            let startReservation = moment(event.startDate).unix();
            if(
                startReservation == dateStart ||
                finishReservation == dateFinish
            ){
                return res.status(400).send({message: 'These event dates are already reserved'});
            }else if(startReservation > dateStart && startReservation < dateFinish){
                return res.status(400).send({message: 'These event dates are already reserved'});
            }else if(startReservation < dateStart && finishReservation > dateStart){
                return res.status(400).send({message: 'These event dates are already reserved'});
            }else if(finishReservation > dateFinish && startReservation < dateFinish){
                return res.status(400).send({message: 'These event dates are already reserved'});
            }else if(finishReservation < dateFinish && finishReservation > dateStart){
                return res.status(400).send({message: 'These event dates are already reserved'});
            }
        }
        data.services = data.services.replace(/\s+/g, '');
        data.prices = data.prices.replace(/\s+/g, '');
        data.extras=[];
        if(data.services.includes(',')){
            data.services = data.services.split(',');
            data.prices = data.prices.split(',');
            for (let i=0; i<data.services.length;i++){
                let service = {
                    service: data.services[i],
                    price:data.prices[i]
                };
                
                if(cost){
                    var cost = cost+Number(data.prices[i]);
                }else{
                    var cost = Number(data.prices[i]);
                }
                data.extras.push(service);
            }
        }else{
            data.extras=[{service: data.services, price: data.prices}];
        }

        if(data.cost < cost)return res.status(400).send({message: 'The cost cannot be less than the total of services'});
        delete data.services;
        delete data.prices;

        let event = new Event(data);
        await event.save();
        return res.send({message: 'Event created successfully'});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error creating event'})
    }
};

exports.getEvents = async(req,res)=>{
    try{
        let hotelId = req.params.idH;
        let hotelExist = await Hotel.findOne({_id: hotelId});
        if(!hotelExist) return res.status(400).send({message: 'Hotel not found'});
        let events = await Event.find({hotel: hotelId})
        .lean()
        .populate('user')
        .populate('hotel');

        for(let event of events){
            await deleteSensitiveData(event);
        }

        return res.send({events});

    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error getting events'})
    }
}