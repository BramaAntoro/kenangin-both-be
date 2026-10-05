import AppError from "../../../lib/app-error.js";
import readDetailSystemSettingRepository from "../repositories/read-detail-system-setting.repository.js";

export default async function readDetailSystemSettingService(id: string){
    const result = await readDetailSystemSettingRepository(id);
    if(!result){
        throw new AppError("System setting tidak ada", )
    }
    return result
}