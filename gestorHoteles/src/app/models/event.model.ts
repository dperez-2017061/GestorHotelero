export class eventModel{
    constructor(
        public _id: string,
        public user: string,
        public type: string,
        public startDate: string,
        public finishDate: string,
        public status: string,
        public extras: string,
        public cost: number,
        public hotel: string
    ){}
}