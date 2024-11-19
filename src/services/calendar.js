import defaultInstance from '../plugins/axios'

export const getNearestEvents = async () => {
  return defaultInstance.get('/api/nearest-events/list')
}
