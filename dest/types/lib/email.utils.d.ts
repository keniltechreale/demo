import { VerificationResult } from './utils';
import { IUser } from '../models/users.model';
import { IRide } from '../models/rides.model';
import { ICashoutRequests } from 'src/models/cashoutRequest.model';
export declare function sendDocumentVerificationMail(user: IUser, verificationStatus: VerificationResult): Promise<void>;
export declare function sendContactUsMail(email: string, content: string): Promise<void>;
export declare function sendRideCompletionMail(user: IUser, content: IRide): Promise<void>;
export declare function sendCashOutRequest(email: string, content: ICashoutRequests): Promise<void>;
export declare function sendCareerApplicationMail(args: Record<string, unknown>): Promise<void>;
