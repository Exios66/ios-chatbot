import { getModels, selectModel } from '../public/js/services/modelService.js';
import axios from 'axios';

jest.mock('axios');

describe('Model Service', () => {
  test('getModels should return an array of models', async () => {
    const mockModels = [{ id: 1, name: 'Model 1' }, { id: 2, name: 'Model 2' }];
    axios.get.mockResolvedValue({ data: mockModels });

    const result = await getModels();
    expect(result).toEqual(mockModels);
  });

  test('selectModel should return the selected model', async () => {
    const mockSelectedModel = { id: 1, name: 'Model 1' };
    axios.post.mockResolvedValue({ data: mockSelectedModel });

    const result = await selectModel(1, 1);
    expect(result).toEqual(mockSelectedModel);
  });
});