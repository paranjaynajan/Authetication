import refreshTokenModel from "../models/refreshTokenModel";
import userModel from "../models/userModel";


export const userLogoutService = async (id: any): Promise<any> => {
  return await refreshTokenModel.deleteOne({
    userId: id,
  });
};

export const userPasswordUpdateService = async (id:string,epassword:string): Promise<any> => {
    return  await userModel.findOneAndUpdate(
      { _id: id },
      { password: epassword },
      { new: true }
    );
};

export const updateImageService = async (id:string ,fileName:string): Promise<any> => {
  return  await userModel.findOneAndUpdate(
      { _id: id },
      { image: fileName },
      { new: true }
    ); 
};

export const fetchMeService = async (id: string): Promise<any > => {
     return await userModel.findOne( {_id:id},{password:0} );
};
