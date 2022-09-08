export class RoomModel{
    constructor(
        public _id: string,
        public noRoom: string,
        public description: string,
        public services: string,
        public type: string,
        public available: boolean,
        public price: number,
        public hotel: string
    ){}
}