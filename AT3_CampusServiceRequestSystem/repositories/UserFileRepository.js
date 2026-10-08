const fs = require('fs/promises');
const path = require('path');
const User = require('../models/User');
const StudentRequester = require('../models/StudentRequester');
const StaffRequester = require('../models/StaffRequester');
const ServiceOfficer = require('../models/ServiceOfficer');
const Technician = require('../models/Technician');

class UserFileRepository {
  constructor(filePath = path.join(__dirname, '../data/users.json')) {
    this.filePath = filePath;
  }

  async ensureDirectory() {
    const dir = path.dirname(this.filePath);
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (error) {
      throw new Error(`Failed to create directory for users repository: ${error.message}`);
    }
  }

  async loadAll() {
    try {
      await this.ensureDirectory();
      const data = await fs.readFile(this.filePath, 'utf8');
      if (!data.trim()) return [];
      
      const plainData = JSON.parse(data);
      // Re-instantiate proper User subclass instances from plain data objects safely
      return plainData.map(item => {
        switch (item.userType) {
          case 'Student':
            return new StudentRequester(
              item.userId, 
              item.firstName, 
              item.lastName, 
              item.email, 
              item.programme || 'General', 
              item.yearLevel || 1
            );
          case 'Staff':
            return new StaffRequester(
              item.userId, 
              item.firstName, 
              item.lastName, 
              item.email, 
              item.department || 'General'
            );
          case 'ServiceOfficer':
            return new ServiceOfficer(
              item.userId, 
              item.firstName, 
              item.lastName, 
              item.email, 
              item.serviceSection || 'General'
            );
          case 'Technician':
            return new Technician(
              item.userId, 
              item.firstName, 
              item.lastName, 
              item.email, 
              item.technicalSpeciality || 'General'
            );
          default:
            return new User(
              item.userId, 
              item.firstName, 
              item.lastName, 
              item.email, 
              item.userType || 'Student'
            );
        }
      });
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw new Error(`File Reading Error (${this.filePath}): ${error.message}`);
    }
  }

  async saveAll(users) {
    try {
      await this.ensureDirectory();
      const serialized = users.map(u => u.toJSON());
      await fs.writeFile(this.filePath, JSON.stringify(serialized, null, 2), 'utf8');
    } catch (error) {
      throw new Error(`File Writing Error (${this.filePath}): ${error.message}`);
    }
  }
}

module.exports = UserFileRepository;