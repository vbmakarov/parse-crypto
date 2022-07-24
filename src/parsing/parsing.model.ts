import {Column, DataType, Model, Table} from "sequelize-typescript";


@Table({tableName: 'parsedata'})
export class ParseModel extends Model<ParseModel>{
    
    @Column({type: DataType.INTEGER, unique:true, autoIncrement: true, primaryKey: true})
    id:number;
    
    @Column({type: DataType.JSON})
    data: string;

}