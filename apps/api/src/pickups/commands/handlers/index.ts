import { DeletePickupByIdHandler } from './delete-pickup-by-id.handler';
import { UpdatePickupByIdHandler } from './update-pickup-by-id.handler';
import { InsertPickupByIdHandler } from './insert-pickup-by-id.handler';

export const PickupCommandHandlers = [
    InsertPickupByIdHandler,
    UpdatePickupByIdHandler,
    DeletePickupByIdHandler,
];
