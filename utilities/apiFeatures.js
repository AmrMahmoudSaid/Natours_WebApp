class APIfeatures{
    constructor(query , querySting) {
        this.query=query;
        this.queryString =querySting;
    }
    filter(){
        const queryObj = {...this.queryString}; // new object
        const excludedfield = [`page` , `sort` , `limit` , `fields`];
        excludedfield.forEach(elem=> delete queryObj[elem]);
        let querySTR = JSON.stringify(queryObj); // object yo string
        querySTR=querySTR.replace(/\b(gte|gt|lte|lt)\b/g, match=>{ // b => to match the exact word || g to make more than one time
            return`$${match}`});
        querySTR=JSON.parse(querySTR); // string to object
        this.query.find(querySTR);
        return this;
    }
    sorting(){
        if (this.queryString.sort){
            const sorting = this.queryString.sort.split(',').join(' ');
            this.query.sort(sorting);
        }else {
            this.query = this.query.sort('-createdAT');
        }
        return this;
    }
    fieldss(){
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ');
            this.query.select(fields);
        }else {
            this.query.select('-__v');
        }
        return this;
    }
    pagination(){
        const page = this.queryString.page * 1 || 1;
        const limits = this.queryString.limit *1 || 100;
        const skip = (page-1) * limits;
        this.query.skip(skip).limit(limits);
        return this;
    }
}

module.exports =APIfeatures;