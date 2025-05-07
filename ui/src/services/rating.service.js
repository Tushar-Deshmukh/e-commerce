import axios from "../axios";
import { ApiConfig } from "../config/ApiConfig";

const addProductRating = async (data) => {
    try {
        const res = await axios.post(ApiConfig.addRating,data);
        return res.data
    } catch (error) {
        if(error){
            console.log('error',error)
            return error;
        }
    }
}

const getProductRating = async (productId) => {
    try {
       const res = await axios.get(`${ApiConfig.ratingByProduct}/${productId}`);
       return res.data 
    } catch (error) {
        return error
    }
}

const ratingService = {
    addProductRating,
    getProductRating
}

export default ratingService;