import { Template } from 'meteor/templating';
import { TasksCollection } from "../db/TasksCollection";
import './App.html';
import './Task.js';
import "./Login.js";
import { ReactiveDict } from 'meteor/reactive-dict';

const HIDE_COMPLETED_STRING = "hideCompleted";
const IS_LOADING_STRING = "isLoading";

const getUser = () => Meteor.user();
const isUserLogged = () => !!getUser();


const getTasksFilter = () => {
  const user = getUser();

  const hideCompletedFilter = { isChecked: { $ne: true } }; //Toán tử $ne được sử dụng để loại bỏ các tài liệu trong collection mà trường isChecked có giá trị true.

  const userFilter = user ? { userId: user._id } : {};

  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

  return { userFilter, pendingOnlyFilter };
}

Template.mainContainer.onCreated(function mainContainerOnCreated() {
  this.state = new ReactiveDict();
  /**
   * Từ đây, chúng tôi có thể đăng ký ấn phẩm đó trong ứng dụng khách.
Vì chúng tôi muốn nhận các thay đổi từ ấn phẩm này, chúng tôi sẽ đăng ký nó bên trong Tracker.autorun.
   */
  const handler = Meteor.subscribe('tasks'); // Đăng ký này sẽ cho phép khách hàng nhận các bản cập nhật từ máy chủ về bộ sưu tập 'tasks'.
  Tracker.autorun(() => {
    this.state.set(IS_LOADING_STRING, !handler.ready());//set cho bien IS_LOADING_STRING = !handler.ready()
  });
})

Template.mainContainer.helpers({
  isUserLogged() {
    return isUserLogged();
  },
  getUser() {
    return getUser();
  },
  isLoading() {
    const instance = Template.instance();
    return instance.state.get(IS_LOADING_STRING);
  },
  tasks() {
      /**
       * Đoạn code trên định nghĩa các hàm trợ giúp (helper functions) cho template mainContainer trong ứng dụng Meteor.

Cụ thể, hàm tasks() trả về danh sách các công việc (tasks) được hiển thị trong giao diện người dùng của ứng dụng. Để làm điều này, hàm sử dụng đối tượng ReactiveDict để lấy trạng thái hiện tại của ứng dụng (được lưu trữ trong biến hideCompleted) và sử dụng nó để tạo bộ lọc cho danh sách các công việc được trả về bởi phương thức find() của collection TasksCollection. Nếu hideCompleted là true, danh sách các công việc sẽ được lọc để loại bỏ các công việc đã hoàn thành (dựa trên trường isChecked), ngược lại thì sẽ trả về toàn bộ danh sách công việc. Kết quả của hàm find() được sắp xếp theo thời gian tạo mới nhất (dựa trên trường createdAt) và trả về dưới dạng một mảng bằng phương thức fetch().

Hàm hideCompleted() đơn giản trả về giá trị của biến hideCompleted, được lấy từ đối tượng ReactiveDict thông qua phương thức get(). Kết quả này được sử dụng để hiển thị trạng thái của checkbox "Ẩn các công việc đã hoàn thành" trong giao diện người dùng.
       */
    const instance = Template.instance();
    const hideCompleted = instance.state.get(HIDE_COMPLETED_STRING);

    const { pendingOnlyFilter, userFilter } = getTasksFilter();

    if (!isUserLogged()) {
      return [];
    }

    return TasksCollection.find(hideCompleted ? pendingOnlyFilter : userFilter, {
      sort: { createdAt: -1 },
    }).fetch();
  },
  hideCompleted() {
    return Template.instance().state.get(HIDE_COMPLETED_STRING);
  },
  incompleteCount() {
    if (!isUserLogged()) {
      return '';
    }

    const { pendingOnlyFilter } = getTasksFilter();

    const incompleteTasksCount = TasksCollection.find(pendingOnlyFilter).count();
    return incompleteTasksCount ? `(${incompleteTasksCount})` : '';
  }
});

Template.mainContainer.events({
  "click #hide-completed-button"(event, instance) {
    /**
     * Đoạn code trên sử dụng đối tượng ReactiveDict trong framework Meteor để lưu trữ và quản lý trạng thái của một phần của ứng dụng.
Trong đoạn code này, instance là một đối tượng được tạo ra bởi template của ứng dụng. HIDE_COMPLETED_STRING là một hằng số định nghĩa giá trị key (tên) của giá trị trong ReactiveDict.
Cụ thể, đoạn code này thực hiện hai việc:
Lấy giá trị hiện tại của HIDE_COMPLETED_STRING từ đối tượng ReactiveDict thông qua phương thức get() và lưu trữ vào biến currentHideCompleted.
Đặt giá trị mới của HIDE_COMPLETED_STRING bằng cách đảo ngược giá trị hiện tại của currentHideCompleted và lưu trữ nó vào đối tượng ReactiveDict thông qua phương thức set(). Điều này sẽ kích hoạt các tính năng phản ứng trong ReactiveDict, tức là tất cả các phần khác của ứng dụng sẽ được cập nhật tự động để phản ánh thay đổi này.
     */
    const currentHideCompleted = instance.state.get(HIDE_COMPLETED_STRING);
    instance.state.set(HIDE_COMPLETED_STRING, !currentHideCompleted);
  },
  'click .user'() {
    Meteor.logout();
  }
});


Template.form.events ( {
  "submit .task-form"(e) {
    e.preventDefault();
    let text = e.target.text.value;
    console.log(text);
    TasksCollection.insert({
      text,
      userId: getUser()._id,
      createdAt: new Date(), // current time
    });
    text = ''
  }
})

