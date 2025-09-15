import { Response } from 'express';
import * as Utils from '../../lib/utils';
import RatingService from '../../services/users/ratings.service';
import { IRequest } from '../../lib/common.interface';

export default new (class CityController {
  addRating = (req: IRequest, res: Response): void => {
    try {
      const body = req.body as Record<string, unknown>;
      RatingService.addRating(body, req.user.id, req.params.user_id)
        .then((result) => {
          res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
        })
        .catch((err) => {
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        });
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  viewAllRating = (req: IRequest, res: Response) => {
    try {
      RatingService.getAllRating(req.params.user_id)
        .then((result) => {
          res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
        })
        .catch((err) => {
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        });
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };
})();
