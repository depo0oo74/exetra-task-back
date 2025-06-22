import { Request, Response } from "express";

const handlingErrors = async (err: Error,  req: Request, res: Response) => {
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: "Error",
            message: err.message || 'Validation failed'
        });
    } 
    
    if (err["errorResponse"]) {
        return res.status(400).json({
            status: "Error",
            message: err["errorResponse"]?.errmsg
        });
    }  

    return res.status(500).json({
        status: "Error",
        message: "Internal server error"
    });
}


export default handlingErrors;