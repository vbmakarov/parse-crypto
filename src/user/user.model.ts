import {Column, DataType, Model, Table} from "sequelize-typescript";
import fs from 'fs'


@Table({tableName: 'users'})
export class UserModel extends Model<UserModel>{
    
    @Column({type: DataType.INTEGER, unique:true, autoIncrement: true, primaryKey: true})
    id:number;
    
    @Column({type: DataType.STRING, unique:true, allowNull:false})
    email:string;
    

    @Column({type: DataType.STRING, allowNull:false})
    password:string;
    

    @Column({type: DataType.ENUM('admin', 'client'), allowNull:false})
    role:string;
}