import _ from "lodash";

import dayjs from "dayjs";

import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);
dayjs.extend(duration);
dayjs.extend(relativeTime);
export default class Backup {
  constructor(opts = {}) {
    this._file_count = 0;
    this._current_messages = [];
    this._warnings = [];
    this._total_size = 0;
    this._error_messages = [];
    this._successful = true;
    this._status = null;
    this._progress = 0;
    this._updated = null;
    this._created = null;
    this._active = false;
    this._size_formatted = null;
    this._device = null;
    this._id = null;
    this._created_files = 0;
    this._total_files = 0;
    this._transferred_files = 0;

    for (const [key, value] of Object.entries(opts)) {
      if (_.has(this, `_${key}`)) _.set(this, `_${key}`, value);
    }
  }

  get statusColor() {
    let color;
    switch (this._status) {
      case "done":
        color = "teal";
        break;
      case "error":
        color = "error";
        break;
      case "done_with_warnings":
        color = "orange-darken-3";
        break;
      case "running":
        color = "light-blue-darken-3";
        break;
    }
    return color;
  }

  get deviceId() {
    return _.get(this._device, "uuid");
  }

  get messages() {
    return this._messages;
  }

  set errorMessages(messages) {
    this._error_messages = [...this._error_messages, ...messages];
  }

  set progress(progress) {
    this._progress = progress;
  }

  get progress() {
    return this._progress;
  }

  get created_local() {
    return dayjs(this._created).format("LLLL");
  }

  get duration() {
    let seconds = dayjs(this._created).diff(
      dayjs(this._updated),
      "seconds",
      true,
    );
    return dayjs.duration(seconds, "seconds").humanize();
  }

  set messages(messages) {
    this._messages = messages;
  }

  get status() {
    return this._status;
  }
}
