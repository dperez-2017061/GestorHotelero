export class ReservationModel{
    constructor(
        public _id: string,
        public user: string,
        public startDate: string,
        public finishDate: string,
        public status: String,
        public hotel: string,
        public room: string,
        public total: number
    ){}
}