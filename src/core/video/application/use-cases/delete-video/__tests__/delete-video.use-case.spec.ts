import { InvalidUuidError } from '@core/shared/domain/value-objects/uuid.vo';
import { Video, VideoId } from '@core/video/domain/video.aggregate';
import { DeleteVideoUseCase } from '../delete-video.use-case';
import { VideoInMemoryRepository } from '@core/video/infra/db/in-memory/video-in-memory.repository';
import { UnitOfWorkFakeInMemory } from '@core/shared/infra/db/in-memory/fake-unit-of-work-in-memory';
import { NotFoundError } from '@core/shared/domain/errors/not-found-erros';

describe('DeleteVideoUseCase Unit Tests', () => {
  let useCase: DeleteVideoUseCase;
  let repository: VideoInMemoryRepository;
  let uow: UnitOfWorkFakeInMemory;

  beforeEach(() => {
    repository = new VideoInMemoryRepository();
    uow = new UnitOfWorkFakeInMemory();
    useCase = new DeleteVideoUseCase(uow, repository);
  });

  it('should throws error when entity not found', async () => {
    await expect(() => useCase.execute({ id: 'fake id' })).rejects.toThrow(
      new InvalidUuidError(),
    );

    const videoId = new VideoId();
    await expect(() => useCase.execute({ id: videoId.id })).rejects.toThrow(
      new NotFoundError(videoId, Video),
    );
  });

  it('should delete a video', async () => {
    const video = Video.fake().aVideoWithAllMedias().build();
    repository.items = [video];

    await useCase.execute({
      id: video.video_id.id,
    });

    expect(repository.items).toHaveLength(0);
  });
});
