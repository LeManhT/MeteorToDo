import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '/imports/db/TasksCollection';
import '/imports/api/tasksMethods';
import '../imports/api/taskPublications';

const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';
const insertTask = (taskText, user) =>
  TasksCollection.insert({
    text: taskText,
    userId: user._id,
    createdAt: new Date(),
  });

Meteor.startup(() => {
     // Hàm Meteor.startup được gọi khi máy chủ khởi động. Nếu TasksCollection trống, nó sẽ thêm một số tác vụ mẫu vào nó bằng cách gọi hàm insertTask cho từng tác vụ trong mảng.
  // Meteor.startup được dùng để khởi tạo cơ sở dữ liệu với một số tác vụ mẫu.
  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }

  const user = Accounts.findUserByUsername(SEED_USERNAME);

  if (TasksCollection.find().count() === 0) {
    [
      'First Task',
      'Second Task',
      'Third Task',
      'Fourth Task',
      'Fifth Task',
      'Sixth Task',
      'Seventh Task',
    ].forEach(taskText => insertTask(taskText, user));
  }
});