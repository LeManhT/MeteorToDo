import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '/imports/db/TasksCollection';

/**
 * Trước tiên, bạn cần thêm một publication vào máy chủ của mình. Ấn phẩm này sẽ xuất bản tất cả các tác vụ từ người dùng được xác thực. Như trong Phương thức, bạn cũng có thể sử dụng this.userId trong các chức năng xuất bản để lấy userId được xác thực.
 */

Meteor.publish('tasks', function publishTasks() {
  return TasksCollection.find({ userId: this.userId });
});