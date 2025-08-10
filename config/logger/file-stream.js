import path from 'node:path';
import * as rotator from 'file-stream-rotator';
import { enviroment } from 'constants/index.js';

const { LOG, ENV } = enviroment;

/** @type {pino.TransportTargetOptions} */
const fileStream = (options) => {
  return rotator.getStream({
    end_stream: true,
    filename: path.join(LOG.DIRECTORY, './%DATE%'),
    frequency: 'daily',
    date_format: 'YYYY-MM-DD',
    size: '100M',
    max_logs: ENV.ISDEVELOPMENT ? '10' : '5',
    audit_file: path.join('./logs', './audit.json'),
    extension: '.log',
    create_symlink: true,
    symlink_name: `current.log`,
    ...options,
  });
}

export default fileStream;