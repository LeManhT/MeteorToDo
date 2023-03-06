import { Template } from 'meteor/templating';

import { TasksCollection } from "../db/TasksCollection";

import './Task.html';

Template.task.events({
  'click .toggle-checked'() {
    // Set the checked property to the opposite of its current value
    /**
     * Trong Meteor, cách dễ nhất để thực hiện các thay đổi trong máy chủ một cách an toàn là khai báo các phương thức thay vì gọi lệnh chèn, cập nhật hoặc xóa trực tiếp trong máy khách.

    Với các phương thức, bạn có thể xác minh xem người dùng có được xác thực và được phép thực hiện các hành động cụ thể hay không, sau đó thay đổi cơ sở dữ liệu cho phù hợp.
     */
    Meteor.call('tasks.setIsChecked', this._id, !this.isChecked)
  },
  'click .delete'() {
    Meteor.call('tasks.remove', this._id);
  }
});