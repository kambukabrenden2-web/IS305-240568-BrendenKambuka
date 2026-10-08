const fs = require('fs/promises');
const path = require('path');
const ServiceRequestFactory = require('../factories/ServiceRequestFactory');

class ServiceRequestFileRepository {
  constructor(filePath = path.join(__dirname, '../data/serviceRequests.json')) {
    this.filePath = filePath;
  }

  async ensureDirectory() {
    const dir = path.dirname(this.filePath);
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (error) {
      throw new Error(`Failed to create directory for requests repository: ${error.message}`);
    }
  }

  async loadAll(userManager) {
    try {
      await this.ensureDirectory();
      const data = await fs.readFile(this.filePath, 'utf8');
      if (!data.trim()) return [];
      
      const plainData = JSON.parse(data);
      // Recreate active specialised class objects using the Factory pattern
      return plainData.map(item => ServiceRequestFactory.createFromData(item, userManager));
    } catch (error) {
      if (error.code === 'ENOENT') {
        return []; // Return empty array if file does not exist yet
      }
      throw new Error(`File Reading Error (${this.filePath}): ${error.message}`);
    }
  }

  async saveAll(requests) {
    try {
      await this.ensureDirectory();
      const serialized = requests.map(r => r.toJSON());
      await fs.writeFile(this.filePath, JSON.stringify(serialized, null, 2), 'utf8');
    } catch (error) {
      throw new Error(`File Writing Error (${this.filePath}): ${error.message}`);
    }
  }
}

module.exports = ServiceRequestFileRepository;