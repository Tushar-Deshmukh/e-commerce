import axios from '../axios'
import { ApiConfig } from '../config/ApiConfig'

const mywishlist = async() => {
    try {
        const res = await axios.get(ApiConfig.mywishlist);
        return res.data
    } catch (error) {
        if(err){
            return error
        }
    }
}

const removefromwishlist = async(productId) => {
    try {
        const res = await axios.delete(`${ApiConfig.removeFromWishlist}/${productId}`);
        return res.data
    } catch (error) {
        if(err){
            return error
        }
    }
}

const wishlistservice = {
    mywishlist,
    removefromwishlist
}

export default wishlistservice