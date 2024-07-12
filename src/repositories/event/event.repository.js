import Models from '../../models';
import BaseRepository from '../base.repository';

export default class EventRepository extends BaseRepository {
  constructor(model = Models.Event) {
    super(model);
  }
}
