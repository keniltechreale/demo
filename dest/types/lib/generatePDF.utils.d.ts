/// <reference types="node" />
import { Buffer } from 'buffer';
import { IUser } from '../models/users.model';
import { ITransaction } from '../models/transaction.model';
import { IRide } from '../models/rides.model';
export declare function createWeeklyStatementPdf(totalAmountUntilStart: number, totalAmountUntilEnd: number, totalAmountExpenses: number, user: IUser, transactions: ITransaction[]): Promise<Buffer>;
export declare function createRideEmailPdf(user: IUser, rideDetails: IRide): Promise<Buffer>;
