import { OnEvent } from '@nestjs/event-emitter';
import { VideoAudioMediaUploadedIntegrationEvent } from '../../domain/domain-events/video-audio-media-replaced.event';
import { IIntegrationEventHandler } from '@core/shared/application/domain-event-handler.interface';
import { IMessageBroker } from '@core/shared/application/message-broker.interface';

export class PublishVideoMediaReplacedInQueueHandler
  implements IIntegrationEventHandler
{
  constructor(private messageBroker: IMessageBroker) {
    console.log(messageBroker);
  }

  @OnEvent(VideoAudioMediaUploadedIntegrationEvent.name)
  async handle(event: VideoAudioMediaUploadedIntegrationEvent): Promise<void> {
    console.log(event);
    await this.messageBroker.publishEvent(event);
  }
}
