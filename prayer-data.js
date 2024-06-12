/*
Fixed typo March [19,2] => [19,20]
Fixed Luhar AM issue (Oct 09 - Nov 27)
Fixed Subah wrong time (Dec 08)
*/
window.PRAYER_DATA = {};

window.PRAYER_DATA.Puttalam = {
  January: [
    { range: [1, 3], times: ['05:03','06:22','12:15','15:35','18:05','19:20'] },
    { range: [4, 6], times: ['05:05','06:24','12:17','15:37','18:07','19:22'] },
    { range: [7, 8], times: ['05:06','06:25','12:18','15:38','18:08','19:23'] },
    { range: [9, 10], times: ['05:07','06:25','12:19','15:39','18:09','19:24'] },
    { range: [11, 12], times: ['05:08','06:26','12:20','15:40','18:10','19:25'] },
    { range: [13, 15], times: ['05:09','06:27','12:20','15:41','18:11','19:26'] },
    { range: [16, 17], times: ['05:10','06:28','12:22','15:43','18:13','19:27'] },
    { range: [18, 20], times: ['05:11','06:28','12:22','15:43','18:14','19:28'] },
    { range: [21, 25], times: ['05:12','06:29','12:23','15:44','18:15','19:29'] },
    { range: [26, 29], times: ['05:12','06:30','12:24','15:46','18:17','19:30'] },
    { range: [30, 31], times: ['05:14','06:30','12:25','15:46','18:18','19:31'] },
  ],
  February: [
    { range: [1, 6], times: ['05:12','06:30','12:26','15:47','18:19','19:31'] },
    { range: [7, 12], times: ['05:12','06:29','12:26','15:47','18:20','19:32'] },
    { range: [13, 17], times: ['05:12','06:28','12:26','15:46','18:21','19:32'] },
    { range: [18, 24], times: ['05:12','06:27','12:26','15:46','18:21','19:32'] },
    { range: [25, 29], times: ['05:10','06:25','12:25','15:44','18:22','19:32'] },
  ],
  March: [
    { range: [1, 4], times: ['05:09','06:24','12:24','15:42','18:22','19:32'] },
    { range: [5, 9], times: ['05:07','06:22','12:23','15:41','18:22','19:32'] },
    { range: [10, 13], times: ['05:05','06:20','12:22','15:38','18:22','19:32'] },
    { range: [14, 18], times: ['05:04','06:18','12:21','15:35','18:22','19:31'] },
    { range: [19, 20], times: ['05:02','06:16','12:20','15:33','18:22','19:31'] },
    { range: [21, 24], times: ['05:00','06:14','12:19','15:31','18:21','19:31'] },
    { range: [25, 27], times: ['04:58','06:13','12:18','15:28','18:21','19:31'] },
    { range: [28, 30], times: ['04:57','06:11','12:17','15:25','18:21','19:30'] },
    { range: [31, 31], times: ['04:55','06:10','12:16','15:22','18:20','19:30'] },
  ],
  April: [
    { range: [1, 2], times: ['04:53','06:10','12:16','15:22','18:21','19:31'] },
    { range: [3, 5], times: ['04:52','06:08','12:15','15:20','18:21','19:31'] },
    { range: [6, 11], times: ['04:50','06:07','12:14','15:17','18:20','19:31'] },
    { range: [12, 14], times: ['04:48','06:05','12:13','15:18','18:20','19:31'] },
    { range: [15, 18], times: ['04:46','06:03','12:12','15:20','18:20','19:31'] },
    { range: [19, 24], times: ['04:44','06:01','12:11','15:22','18:20','19:31'] },
    { range: [25, 29], times: ['04:41','05:59','12:10','15:24','18:20','19:31'] },
    { range: [30, 30], times: ['04:39','05:57','12:09','15:26','18:20','19:32'] },
  ],
  May: [
    { range: [1, 3], times: ['04:37','05:57','12:09','15:27','18:20','19:32'] },
    { range: [4, 8], times: ['04:36','05:57','12:09','15:28','18:20','19:33'] },
    { range: [9, 14], times: ['04:34','05:55','12:08','15:29','18:21','19:34'] },
    { range: [15, 19], times: ['04:33','05:54','12:08','15:31','18:21','19:35'] },
    { range: [20, 25], times: ['04:32','05:54','12:08','15:33','18:22','19:37'] },
    { range: [26, 28], times: ['04:31','05:53','12:09','15:35','18:23','19:39'] },
    { range: [29, 31], times: ['04:31','05:54','12:09','15:37','18:25','19:41'] },
  ],
  June: [
    { range: [1, 6], times: ['04:30','05:54','12:10','15:39','18:27','19:43'] },
    { range: [7, 10], times: ['04:29','05:54','12:11','15:41','18:28','19:45'] },
    { range: [11, 14], times: ['04:29','05:55','12:11','15:42','18:29','19:46'] },
    { range: [15, 17], times: ['04:30','05:55','12:12','15:42','18:30','19:47'] },
    { range: [18, 20], times: ['04:30','05:56','12:13','15:43','18:31','19:47'] },
    { range: [21, 25], times: ['04:31','05:57','12:14','15:44','18:32','19:48'] },
    { range: [26, 30], times: ['04:32','05:58','12:15','15:45','18:33','19:50'] },
  ],
  July: [
    { range: [1, 6], times: ['04:33','05:59','12:16','15:45','18:33','19:49'] },
    { range: [7, 10], times: ['04:35','06:00','12:17','15:46','18:34','19:50'] },
    { range: [11, 18], times: ['04:37','06:01','12:17','15:46','18:34','19:50'] },
    { range: [19, 23], times: ['04:39','06:03','12:18','15:45','18:34','19:49'] },
    { range: [24, 29], times: ['04:40','06:03','12:18','15:44','18:33','19:48'] },
    { range: [30, 31], times: ['04:41','06:04','12:18','15:42','18:33','19:46'] },
  ],
  August: [
    { range: [1, 4], times: ['04:43','06:04','12:18','15:40','18:32','19:45'] },
    { range: [5, 9], times: ['04:44','06:05','12:18','15:39','18:30','19:44'] },
    { range: [10, 14], times: ['04:44','06:04','12:17','15:36','18:28','19:41'] },
    { range: [15, 19], times: ['04:45','06:04','12:16','15:32','18:27','19:39'] },
    { range: [20, 23], times: ['04:45','06:04','12:15','15:29','18:25','19:37'] },
    { range: [24, 26], times: ['04:45','06:04','12:14','15:26','18:23','19:35'] },
    { range: [27, 29], times: ['04:46','06:04','12:13','15:23','18:22','19:33'] },
    { range: [30, 31], times: ['04:46','06:03','12:13','15:20','18:20','19:31'] },
  ],
  September: [
    { range: [1, 1], times: ['04:49','06:03','12:12','15:17','18:19','19:30'] },
    { range: [2, 4], times: ['04:49','06:03','12:12','15:17','18:19','19:29'] },
    { range: [5, 8], times: ['04:49','06:03','12:11','15:14','18:17','19:28'] },
    { range: [9, 11], times: ['04:48','06:02','12:09','15:14','18:15','19:26'] },
    { range: [12, 14], times: ['04:48','06:02','12:08','15:15','18:14','19:24'] },
    { range: [15, 17], times: ['04:47','06:01','12:07','15:15','18:12','19:22'] },
    { range: [18, 22], times: ['04:47','06:00','12:06','15:16','18:10','19:20'] },
    { range: [23, 26], times: ['04:46','06:00','12:04','15:17','18:08','19:18'] },
    { range: [27, 30], times: ['04:46','05:59','12:03','15:17','18:06','19:15'] },
  ],
  October: [
    { range: [1, 2], times: ['04:44','05:58','12:02','15:16','18:03','19:12'] },
    { range: [3, 6], times: ['04:43','05:58','12:01','15:16','18:01','19:11'] },
    { range: [7, 8], times: ['04:42','05:58','12:00','15:16','17:59','19:09'] },
    { range: [9, 13], times: ['04:42','05:58','11:59','15:16','17:58','19:08'] },
    { range: [14, 16], times: ['04:41','05:57','11:58','15:16','17:56','19:06'] },
    { range: [17, 22], times: ['04:41','05:57','11:57','15:16','17:55','19:05'] },
    { range: [23, 31], times: ['04:41','05:57','11:56','15:17','17:53','19:04'] },
  ],
  November: [
    { range: [1, 7], times: ['04:43','05:59','11:56','15:16','17:50','19:02'] },
    { range: [8, 15], times: ['04:43','06:00','11:56','15:17','17:49','19:01'] },
    { range: [16, 21], times: ['04:44','06:02','11:57','15:18','17:49','19:02'] },
    { range: [22, 24], times: ['04:45','06:03','11:58','15:19','17:50','19:03'] },
    { range: [25, 27], times: ['04:47','06:05','11:59','15:20','17:50','19:04'] },
    { range: [28, 30], times: ['04:47','06:06','12:00','15:21','17:51','19:05'] },
  ],
  December: [
    { range: [1, 3], times: ['04:49','06:08','12:01','15:22','17:52','19:06'] },
    { range: [4, 6], times: ['04:50','06:09','12:02','15:23','17:53','19:07'] },
    { range: [7, 9], times: ['04:51','06:10','12:04','15:24','17:54','19:08'] },
    { range: [10, 11], times: ['04:52','06:12','12:05','15:25','17:55','19:10'] },
    { range: [12, 14], times: ['04:53','06:13','12:06','15:27','17:56','19:11'] },
    { range: [15, 16], times: ['04:55','06:15','12:07','15:28','17:57','19:13'] },
    { range: [17, 18], times: ['04:56','06:15','12:08','15:29','17:58','19:13'] },
    { range: [19, 20], times: ['04:56','06:16','12:09','15:29','17:59','19:14'] },
    { range: [21, 21], times: ['04:58','06:18','12:10','15:31','18:00','19:15'] },
    { range: [22, 25], times: ['04:58','06:18','12:11','15:31','18:01','19:16'] },
    { range: [26, 27], times: ['04:59','06:19','12:13','15:32','18:02','19:17'] },
    { range: [28, 29], times: ['05:01','06:21','12:14','15:34','18:03','19:18'] },
    { range: [30, 31], times: ['05:02','06:22','12:15','15:35','18:04','19:19'] },
  ],
};

window.PRAYER_DATA.Colombo = {
  January: [
    { range: [1, 3], times: ['05:00','06:22','12:15','15:36','18:06','19:21'] },
    { range: [4, 6], times: ['05:02','06:24','12:17','15:38','18:08','19:23'] },
    { range: [7, 8], times: ['05:03','06:25','12:18','15:39','18:09','19:24'] },
    { range: [9, 10], times: ['05:04','06:25','12:19','15:40','18:10','19:25'] },
    { range: [11, 12], times: ['05:05','06:26','12:20','15:41','18:11','19:26'] },
    { range: [13, 15], times: ['05:06','06:27','12:20','15:42','18:12','19:27'] },
    { range: [16, 17], times: ['05:07','06:28','12:22','15:44','18:14','19:28'] },
    { range: [18, 20], times: ['05:08','06:28','12:22','15:44','18:15','19:29'] },
    { range: [21, 25], times: ['05:09','06:29','12:23','15:45','18:16','19:30'] },
    { range: [26, 29], times: ['05:10','06:30','12:24','15:47','18:18','19:31'] },
    { range: [30, 31], times: ['05:11','06:30','12:25','15:47','18:19','19:32'] },
  ],
  February: [
    { range: [1, 6], times: ['05:11','06:30','12:26','15:48','18:20','19:32'] },
    { range: [7, 12], times: ['05:11','06:29','12:26','15:48','18:21','19:33'] },
    { range: [13, 17], times: ['05:11','06:28','12:26','15:47','18:22','19:33'] },
    { range: [18, 24], times: ['05:11','06:27','12:26','15:47','18:22','19:33'] },
    { range: [25, 29], times: ['05:09','06:25','12:25','15:45','18:23','19:33'] },
  ],
  March: [
    { range: [1, 4], times: ['05:08','06:24','12:24','15:42','18:22','19:32'] },
    { range: [5, 9], times: ['05:06','06:22','12:23','15:41','18:22','19:32'] },
    { range: [10, 13], times: ['05:04','06:20','12:22','15:38','18:22','19:32'] },
    { range: [14, 18], times: ['05:03','06:18','12:21','15:35','18:22','19:31'] },
    { range: [19, 20], times: ['05:01','06:16','12:20','15:33','18:22','19:31'] },
    { range: [21, 24], times: ['04:59','06:14','12:19','15:31','18:21','19:31'] },
    { range: [25, 27], times: ['04:57','06:13','12:18','15:28','18:21','19:31'] },
    { range: [28, 30], times: ['04:56','06:11','12:17','15:25','18:21','19:30'] },
    { range: [31, 31], times: ['04:54','06:10','12:16','15:22','18:20','19:30'] },
  ],
  April: [
    { range: [1, 2], times: ['04:53','06:10','12:16','15:21','18:20','19:30'] },
    { range: [3, 5], times: ['04:52','06:08','12:15','15:19','18:20','19:30'] },
    { range: [6, 11], times: ['04:50','06:07','12:14','15:16','18:19','19:30'] },
    { range: [12, 14], times: ['04:48','06:05','12:13','15:17','18:19','19:30'] },
    { range: [15, 18], times: ['04:46','06:03','12:12','15:19','18:19','19:30'] },
    { range: [19, 24], times: ['04:44','06:01','12:11','15:21','18:19','19:30'] },
    { range: [25, 29], times: ['04:41','05:59','12:10','15:23','18:19','19:30'] },
    { range: [30, 30], times: ['04:39','05:57','12:09','15:25','18:19','19:31'] },
  ],
  May: [
    { range: [1, 3], times: ['04:38','05:57','12:09','15:26','18:19','19:31'] },
    { range: [4, 8], times: ['04:37','05:57','12:09','15:27','18:19','19:32'] },
    { range: [9, 14], times: ['04:35','05:55','12:08','15:28','18:20','19:33'] },
    { range: [15, 19], times: ['04:34','05:54','12:08','15:30','18:20','19:34'] },
    { range: [20, 25], times: ['04:33','05:54','12:08','15:32','18:21','19:36'] },
    { range: [26, 28], times: ['04:32','05:53','12:09','15:34','18:22','19:38'] },
    { range: [29, 31], times: ['04:32','05:54','12:09','15:35','18:23','19:39'] },
  ],
  June: [
    { range: [1, 6], times: ['04:32','05:54','12:10','15:36','18:24','19:40'] },
    { range: [7, 10], times: ['04:31','05:54','12:11','15:38','18:25','19:42'] },
    { range: [11, 14], times: ['04:31','05:55','12:11','15:39','18:26','19:43'] },
    { range: [15, 17], times: ['04:32','05:55','12:12','15:39','18:27','19:44'] },
    { range: [18, 20], times: ['04:32','05:56','12:13','15:40','18:28','19:44'] },
    { range: [21, 25], times: ['04:33','05:57','12:14','15:41','18:29','19:45'] },
    { range: [26, 30], times: ['04:34','05:58','12:15','15:42','18:30','19:47'] },
  ],
  July: [
    { range: [1, 6], times: ['04:35','05:59','12:16','15:43','18:31','19:47'] },
    { range: [7, 10], times: ['04:37','06:00','12:17','15:44','18:32','19:48'] },
    { range: [11, 18], times: ['04:39','06:01','12:17','15:44','18:32','19:48'] },
    { range: [19, 23], times: ['04:41','06:03','12:18','15:43','18:32','19:47'] },
    { range: [24, 29], times: ['04:42','06:03','12:18','15:42','18:31','19:46'] },
    { range: [30, 31], times: ['04:43','06:04','12:18','15:40','18:31','19:44'] },
  ],
  August: [
    { range: [1, 4], times: ['04:44','06:04','12:18','15:39','18:31','19:44'] },
    { range: [5, 9], times: ['04:45','06:05','12:18','15:38','18:29','19:43'] },
    { range: [10, 14], times: ['04:45','06:04','12:17','15:35','18:27','19:40'] },
    { range: [15, 19], times: ['04:46','06:04','12:16','15:31','18:26','19:38'] },
    { range: [20, 23], times: ['04:46','06:04','12:15','15:28','18:24','19:36'] },
    { range: [24, 26], times: ['04:46','06:04','12:14','15:25','18:22','19:34'] },
    { range: [27, 29], times: ['04:47','06:04','12:13','15:22','18:21','19:32'] },
    { range: [30, 31], times: ['04:47','06:03','12:13','15:19','18:19','19:30'] },
  ],
  September: [
    { range: [1, 1], times: ['04:47','06:03','12:12','15:16','18:18','19:29'] },
    { range: [2, 4], times: ['04:47','06:03','12:12','15:16','18:18','19:28'] },
    { range: [5, 8], times: ['04:47','06:03','12:11','15:13','18:16','19:27'] },
    { range: [9, 11], times: ['04:46','06:02','12:09','15:13','18:14','19:25'] },
    { range: [12, 14], times: ['04:46','06:02','12:08','15:14','18:13','19:23'] },
    { range: [15, 17], times: ['04:45','06:01','12:07','15:14','18:11','19:21'] },
    { range: [18, 22], times: ['04:45','06:00','12:06','15:15','18:09','19:19'] },
    { range: [23, 26], times: ['04:44','06:00','12:04','15:16','18:07','19:17'] },
    { range: [27, 30], times: ['04:44','05:59','12:03','15:16','18:05','19:14'] },
  ],
  October: [
    { range: [1, 2], times: ['04:43','05:58','12:02','15:16','18:03','19:12'] },
    { range: [3, 6], times: ['04:43','05:58','12:01','15:16','18:01','19:11'] },
    { range: [7, 8], times: ['04:42','05:58','12:00','15:16','17:59','19:09'] },
    { range: [9, 13], times: ['04:42','05:58','11:59','15:16','17:58','19:08'] },
    { range: [14, 16], times: ['04:41','05:57','11:58','15:16','17:56','19:06'] },
    { range: [17, 22], times: ['04:41','05:57','11:57','15:16','17:55','19:05'] },
    { range: [23, 31], times: ['04:41','05:57','11:56','15:17','17:53','19:04'] },
  ],
  November: [
    { range: [1, 7], times: ['04:41','05:59','11:56','15:17','17:51','19:03'] },
    { range: [8, 15], times: ['04:41','06:00','11:56','15:18','17:50','19:02'] },
    { range: [16, 21], times: ['04:42','06:02','11:57','15:19','17:50','19:03'] },
    { range: [22, 24], times: ['04:43','06:03','11:58','15:20','17:51','19:04'] },
    { range: [25, 27], times: ['04:45','06:05','11:59','15:21','17:51','19:05'] },
    { range: [28, 30], times: ['04:45','06:06','12:00','15:22','17:52','19:06'] },
  ],
  December: [
    { range: [1, 3], times: ['04:47','06:08','12:01','15:23','17:53','19:07'] },
    { range: [4, 6], times: ['04:48','06:09','12:02','15:24','17:54','19:08'] },
    { range: [7, 9], times: ['04:49','06:10','12:04','15:25','17:55','19:09'] },
    { range: [10, 11], times: ['04:50','06:12','12:05','15:26','17:56','19:11'] },
    { range: [12, 14], times: ['04:51','06:13','12:06','15:28','17:57','19:12'] },
    { range: [15, 16], times: ['04:53','06:15','12:07','15:29','17:58','19:14'] },
    { range: [17, 18], times: ['04:54','06:15','12:08','15:30','17:59','19:14'] },
    { range: [19, 20], times: ['04:54','06:16','12:09','15:30','18:00','19:15'] },
    { range: [21, 21], times: ['04:56','06:18','12:10','15:32','18:01','19:16'] },
    { range: [22, 25], times: ['04:56','06:18','12:11','15:32','18:02','19:17'] },
    { range: [26, 27], times: ['04:57','06:19','12:13','15:33','18:03','19:18'] },
    { range: [28, 29], times: ['04:59','06:21','12:14','15:35','18:04','19:19'] },
    { range: [30, 31], times: ['05:00','06:22','12:15','15:36','18:05','19:20'] },
  ],
};


window.PRAYER_DATA.Mannar = {
  January: [
    { range: [1, 1], times: ['05:05','06:27','12:15','15:41','18:11','19:26'] },
    { range: [2, 3], times: ['05:06','06:28','12:16','15:42','18:12','19:27'] },
    { range: [4, 6], times: ['05:07','06:29','12:17','15:43','18:13','19:28'] },
    { range: [7, 8], times: ['05:08','06:30','12:18','15:44','18:14','19:29'] },
    { range: [9, 10], times: ['05:09','06:31','12:19','15:45','18:15','19:30'] },
    { range: [11, 12], times: ['05:10','06:32','12:20','15:46','18:16','19:31'] },
    { range: [13, 13], times: ['05:11','06:32','12:20','15:47','18:17','19:32'] },
    { range: [14, 15], times: ['05:11','06:33','12:21','15:48','18:18','19:32'] },
    { range: [16, 17], times: ['05:12','06:33','12:22','15:49','18:19','19:33'] },
    { range: [18, 20], times: ['05:13','06:33','12:22','15:49','18:20','19:34'] },
    { range: [21, 21], times: ['05:14','06:34','12:23','15:50','18:21','19:35'] },
    { range: [22, 25], times: ['05:14','06:34','12:23','15:51','18:22','19:35'] },
    { range: [26, 29], times: ['05:15','06:35','12:24','15:52','18:23','19:36'] },
    { range: [30, 31], times: ['05:16','06:35','12:25','15:52','18:24','19:37'] },
  ],
  February: [
    { range: [1, 6], times: ['05:16','06:35','12:26','15:53','18:25','19:37'] },
    { range: [7, 12], times: ['05:16','06:34','12:26','15:53','18:26','19:38'] },
    { range: [13, 17], times: ['05:16','06:33','12:26','15:52','18:27','19:38'] },
    { range: [18, 24], times: ['05:16','06:32','12:26','15:52','18:27','19:38'] },
    { range: [25, 29], times: ['05:14','06:30','12:25','15:50','18:28','19:38'] },
  ],
  March: [
    { range: [1, 4], times: ['05:13','06:29','12:24','15:47','18:27','19:37'] },
    { range: [5, 9], times: ['05:11','06:27','12:23','15:46','18:27','19:37'] },
    { range: [10, 13], times: ['05:09','06:25','12:22','15:43','18:27','19:37'] },
    { range: [14, 18], times: ['05:08','06:23','12:21','15:40','18:27','19:36'] },
    { range: [19, 20], times: ['05:06','06:21','12:20','15:38','18:27','19:36'] },
    { range: [21, 24], times: ['05:04','06:19','12:19','15:36','18:26','19:36'] },
    { range: [25, 27], times: ['05:02','06:18','12:18','15:33','18:26','19:36'] },
    { range: [28, 30], times: ['05:01','06:16','12:17','15:30','18:26','19:35'] },
    { range: [31, 31], times: ['04:59','06:15','12:16','15:27','18:25','19:35'] },
  ],
  April: [
    { range: [1, 2], times: ['04:59','06:15','12:16','15:27','18:25','19:35'] },
    { range: [3, 5], times: ['04:57','06:13','12:15','15:24','18:25','19:35'] },
    { range: [6, 11], times: ['04:55','06:12','12:14','15:21','18:24','19:35'] },
    { range: [12, 14], times: ['04:53','06:10','12:13','15:22','18:24','19:35'] },
    { range: [15, 18], times: ['04:51','06:08','12:12','15:24','18:24','19:35'] },
    { range: [19, 24], times: ['04:49','06:06','12:11','15:26','18:24','19:35'] },
    { range: [25, 29], times: ['04:46','06:04','12:10','15:28','18:24','19:35'] },
    { range: [30, 30], times: ['04:44','06:02','12:09','15:30','18:24','19:36'] },
  ],
  May: [
    { range: [1, 3], times: ['04:44','06:02','12:09','15:30','18:24','19:36'] },
    { range: [4, 8], times: ['04:42','06:02','12:09','15:32','18:24','19:37'] },
    { range: [9, 14], times: ['04:40','06:00','12:08','15:33','18:25','19:38'] },
    { range: [15, 19], times: ['04:39','05:59','12:08','15:35','18:25','19:39'] },
    { range: [20, 25], times: ['04:38','05:59','12:08','15:37','18:26','19:41'] },
    { range: [26, 28], times: ['04:37','05:58','12:09','15:39','18:27','19:43'] },
    { range: [29, 31], times: ['04:37','05:59','12:09','15:40','18:28','19:44'] },
  ],
  June: [
    { range: [1, 6], times: ['04:37','05:59','12:10','15:41','18:29','19:45'] },
    { range: [7, 10], times: ['04:36','05:59','12:11','15:43','18:30','19:47'] },
    { range: [11, 14], times: ['04:36','06:00','12:11','15:44','18:31','19:48'] },
    { range: [15, 17], times: ['04:37','06:00','12:12','15:44','18:32','19:49'] },
    { range: [18, 20], times: ['04:37','06:01','12:13','15:45','18:33','19:49'] },
    { range: [21, 25], times: ['04:38','06:02','12:14','15:46','18:34','19:50'] },
    { range: [26, 30], times: ['04:39','06:03','12:15','15:47','18:35','19:52'] },
  ],
  July: [
    { range: [1, 6], times: ['04:40','06:04','12:16','15:48','18:36','19:52'] },
    { range: [7, 10], times: ['04:42','06:05','12:17','15:49','18:36','19:53'] },
    { range: [11, 18], times: ['04:44','06:06','12:17','15:49','18:37','19:53'] },
    { range: [19, 23], times: ['04:46','06:08','12:18','15:48','18:37','19:52'] },
    { range: [24, 29], times: ['04:47','06:08','12:18','15:47','18:36','19:51'] },
    { range: [30, 31], times: ['04:48','06:09','12:18','15:45','18:36','19:49'] },
  ],
  August: [
    { range: [1, 4], times: ['04:48','06:09','12:18','15:45','18:36','19:49'] },
    { range: [5, 9], times: ['04:50','06:10','12:18','15:43','18:34','19:48'] },
    { range: [10, 14], times: ['04:50','06:09','12:17','15:40','18:32','19:45'] },
    { range: [15, 19], times: ['04:51','06:09','12:16','15:36','18:31','19:43'] },
    { range: [20, 23], times: ['04:51','06:09','12:15','15:33','18:29','19:41'] },
    { range: [24, 26], times: ['04:51','06:09','12:14','15:30','18:27','19:39'] },
    { range: [27, 29], times: ['04:52','06:09','12:13','15:27','18:26','19:37'] },
    { range: [30, 31], times: ['04:52','06:08','12:13','15:24','18:24','19:35'] },
  ],
  September: [
    { range: [1, 1], times: ['04:52','06:08','12:13','15:24','18:24','19:35'] },
    { range: [2, 4], times: ['04:52','06:08','12:12','15:21','18:23','19:33'] },
    { range: [5, 8], times: ['04:52','06:08','12:11','15:18','18:21','19:32'] },
    { range: [9, 11], times: ['04:51','06:07','12:09','15:18','18:19','19:30'] },
    { range: [12, 14], times: ['04:51','06:07','12:08','15:19','18:18','19:28'] },
    { range: [15, 17], times: ['04:50','06:06','12:07','15:19','18:16','19:26'] },
    { range: [18, 22], times: ['04:50','06:05','12:06','15:20','18:14','19:24'] },
    { range: [23, 26], times: ['04:49','06:05','12:04','15:21','18:12','19:22'] },
    { range: [27, 30], times: ['04:49','06:04','12:03','15:21','18:10','19:19'] },
  ],
  October: [
    { range: [1, 2], times: ['04:48','06:04','12:02','15:21','18:08','19:17'] },
    { range: [3, 6], times: ['04:48','06:03','12:01','15:21','18:06','19:16'] },
    { range: [7, 8], times: ['04:47','06:03','12:00','15:21','18:04','19:14'] },
    { range: [9, 13], times: ['04:47','06:03','11:59','15:21','18:03','19:13'] },
    { range: [14, 16], times: ['04:46','06:02','11:58','15:21','18:01','19:11'] },
    { range: [17, 22], times: ['04:46','06:02','11:57','15:21','18:00','19:10'] },
    { range: [23, 31], times: ['04:46','06:02','11:56','15:22','17:58','19:09'] },
  ],
  November: [
    { range: [1, 7], times: ['04:46','06:04','11:56','15:22','17:56','19:08'] },
    { range: [8, 15], times: ['04:46','06:05','11:56','15:23','17:55','19:07'] },
    { range: [16, 21], times: ['04:47','06:07','11:57','15:24','17:55','19:08'] },
    { range: [22, 24], times: ['04:48','06:08','11:58','15:25','17:56','19:09'] },
    { range: [25, 27], times: ['04:50','06:10','11:59','15:26','17:56','19:10'] },
    { range: [28, 30], times: ['04:50','06:11','12:00','15:27','17:57','19:11'] },
  ],
  December: [
    { range: [1, 3], times: ['04:52','06:13','12:01','15:28','17:58','19:12'] },
    { range: [4, 6], times: ['04:53','06:14','12:02','15:29','17:59','19:13'] },
    { range: [7, 9], times: ['04:54','06:15','12:04','15:30','18:00','19:14'] },
    { range: [10, 11], times: ['04:55','06:17','12:05','15:31','18:01','19:16'] },
    { range: [12, 14], times: ['04:56','06:18','12:06','15:33','18:02','19:17'] },
    { range: [15, 16], times: ['04:58','06:20','12:07','15:34','18:03','19:19'] },
    { range: [17, 18], times: ['04:59','06:20','12:08','15:35','18:04','19:19'] },
    { range: [19, 20], times: ['04:59','06:21','12:09','15:35','18:05','19:20'] },
    { range: [21, 21], times: ['05:01','06:23','12:10','15:37','18:06','19:21'] },
    { range: [22, 25], times: ['05:01','06:23','12:11','15:37','18:07','19:22'] },
    { range: [26, 27], times: ['05:02','06:25','12:13','15:38','18:08','19:23'] },
    { range: [28, 29], times: ['05:04','06:26','12:14','15:40','18:09','19:24'] },
    { range: [30, 31], times: ['05:05','06:26','12:15','15:41','18:10','19:25'] },
  ],
};

window.PRAYER_DATA.Central = {
  January: [
    { range: [1, 3], times: ['05:00','06:22','12:15','15:36','18:06','19:21'] },
    { range: [4, 6], times: ['05:02','06:24','12:17','15:38','18:08','19:23'] },
    { range: [7, 8], times: ['05:03','06:25','12:18','15:39','18:09','19:24'] },
    { range: [9, 10], times: ['05:04','06:25','12:19','15:40','18:10','19:25'] },
    { range: [11, 12], times: ['05:05','06:26','12:20','15:41','18:11','19:26'] },
    { range: [13, 15], times: ['05:06','06:27','12:20','15:42','18:12','19:27'] },
    { range: [16, 17], times: ['05:07','06:28','12:22','15:44','18:14','19:28'] },
    { range: [18, 20], times: ['05:08','06:28','12:22','15:44','18:15','19:29'] },
    { range: [21, 25], times: ['05:09','06:29','12:23','15:45','18:16','19:30'] },
    { range: [26, 29], times: ['05:10','06:30','12:24','15:47','18:18','19:31'] },
    { range: [30, 31], times: ['05:11','06:30','12:25','15:47','18:19','19:32'] },
  ],
  February: [
    { range: [1, 6], times: ['05:11','06:30','12:26','15:48','18:20','19:32'] },
    { range: [7, 12], times: ['05:11','06:29','12:26','15:48','18:21','19:33'] },
    { range: [13, 17], times: ['05:11','06:28','12:26','15:47','18:22','19:33'] },
    { range: [18, 24], times: ['05:11','06:27','12:26','15:47','18:22','19:33'] },
    { range: [25, 29], times: ['05:09','06:25','12:25','15:45','18:23','19:33'] },
  ],
  March: [
    { range: [1, 4], times: ['05:08','06:24','12:24','15:42','18:22','19:32'] },
    { range: [5, 9], times: ['05:06','06:22','12:23','15:41','18:22','19:32'] },
    { range: [10, 13], times: ['05:04','06:20','12:22','15:38','18:22','19:32'] },
    { range: [14, 18], times: ['05:03','06:18','12:21','15:35','18:22','19:31'] },
    { range: [19, 20], times: ['05:01','06:16','12:20','15:33','18:22','19:31'] },
    { range: [21, 24], times: ['04:59','06:14','12:19','15:31','18:21','19:31'] },
    { range: [25, 27], times: ['04:57','06:13','12:18','15:28','18:21','19:31'] },
    { range: [28, 30], times: ['04:56','06:11','12:17','15:25','18:21','19:30'] },
    { range: [31, 31], times: ['04:54','06:10','12:16','15:22','18:20','19:30'] },
  ],
  April: [
    { range: [1, 2], times: ['04:53','06:10','12:16','15:21','18:20','19:30'] },
    { range: [3, 5], times: ['04:52','06:08','12:15','15:19','18:20','19:30'] },
    { range: [6, 11], times: ['04:50','06:07','12:14','15:16','18:19','19:30'] },
    { range: [12, 14], times: ['04:48','06:05','12:13','15:17','18:19','19:30'] },
    { range: [15, 18], times: ['04:46','06:03','12:12','15:19','18:19','19:30'] },
    { range: [19, 24], times: ['04:44','06:01','12:11','15:21','18:19','19:30'] },
    { range: [25, 29], times: ['04:41','05:59','12:10','15:23','18:19','19:30'] },
    { range: [30, 30], times: ['04:39','05:57','12:09','15:25','18:19','19:31'] },
  ],
  May: [
    { range: [1, 3], times: ['04:38','05:57','12:09','15:26','18:19','19:31'] },
    { range: [4, 8], times: ['04:37','05:57','12:09','15:27','18:19','19:32'] },
    { range: [9, 14], times: ['04:35','05:55','12:08','15:28','18:20','19:33'] },
    { range: [15, 19], times: ['04:34','05:54','12:08','15:30','18:20','19:34'] },
    { range: [20, 25], times: ['04:33','05:54','12:08','15:32','18:21','19:36'] },
    { range: [26, 28], times: ['04:32','05:53','12:09','15:34','18:22','19:38'] },
    { range: [29, 31], times: ['04:32','05:54','12:09','15:35','18:23','19:39'] },
  ],
  June: [
    { range: [1, 6], times: ['04:32','05:54','12:10','15:36','18:24','19:40'] },
    { range: [7, 10], times: ['04:31','05:54','12:11','15:38','18:25','19:42'] },
    { range: [11, 14], times: ['04:31','05:55','12:11','15:39','18:26','19:43'] },
    { range: [15, 17], times: ['04:32','05:55','12:12','15:39','18:27','19:44'] },
    { range: [18, 20], times: ['04:32','05:56','12:13','15:40','18:28','19:44'] },
    { range: [21, 25], times: ['04:33','05:57','12:14','15:41','18:29','19:45'] },
    { range: [26, 30], times: ['04:34','05:58','12:15','15:42','18:30','19:47'] },
  ],
  July: [
    { range: [1, 6], times: ['04:35','05:59','12:16','15:43','18:31','19:47'] },
    { range: [7, 10], times: ['04:37','06:00','12:17','15:44','18:32','19:48'] },
    { range: [11, 18], times: ['04:39','06:01','12:17','15:44','18:32','19:48'] },
    { range: [19, 23], times: ['04:41','06:03','12:18','15:43','18:32','19:47'] },
    { range: [24, 29], times: ['04:42','06:03','12:18','15:42','18:31','19:46'] },
    { range: [30, 31], times: ['04:43','06:04','12:18','15:40','18:31','19:44'] },
  ],
  August: [
    { range: [1, 4], times: ['04:44','06:04','12:18','15:39','18:31','19:44'] },
    { range: [5, 9], times: ['04:45','06:05','12:18','15:38','18:29','19:43'] },
    { range: [10, 14], times: ['04:45','06:04','12:17','15:35','18:27','19:40'] },
    { range: [15, 19], times: ['04:46','06:04','12:16','15:31','18:26','19:38'] },
    { range: [20, 23], times: ['04:46','06:04','12:15','15:28','18:24','19:36'] },
    { range: [24, 26], times: ['04:46','06:04','12:14','15:25','18:22','19:34'] },
    { range: [27, 29], times: ['04:47','06:04','12:13','15:22','18:21','19:32'] },
    { range: [30, 31], times: ['04:47','06:03','12:13','15:19','18:19','19:30'] },
  ],
  September: [
    { range: [1, 1], times: ['04:47','06:03','12:12','15:16','18:18','19:29'] },
    { range: [2, 4], times: ['04:47','06:03','12:12','15:16','18:18','19:28'] },
    { range: [5, 8], times: ['04:47','06:03','12:11','15:13','18:16','19:27'] },
    { range: [9, 11], times: ['04:46','06:02','12:09','15:13','18:14','19:25'] },
    { range: [12, 14], times: ['04:46','06:02','12:08','15:14','18:13','19:23'] },
    { range: [15, 17], times: ['04:45','06:01','12:07','15:14','18:11','19:21'] },
    { range: [18, 22], times: ['04:45','06:00','12:06','15:15','18:09','19:19'] },
    { range: [23, 26], times: ['04:44','06:00','12:04','15:16','18:07','19:17'] },
    { range: [27, 30], times: ['04:44','05:59','12:03','15:16','18:05','19:14'] },
  ],
  October: [
    { range: [1, 2], times: ['04:43','05:58','12:02','15:16','18:03','19:12'] },
    { range: [3, 6], times: ['04:43','05:58','12:01','15:16','18:01','19:11'] },
    { range: [7, 8], times: ['04:42','05:58','12:00','15:16','17:59','19:09'] },
    { range: [9, 13], times: ['04:42','05:58','11:59','15:16','17:58','19:08'] },
    { range: [14, 16], times: ['04:41','05:57','11:58','15:16','17:56','19:06'] },
    { range: [17, 22], times: ['04:41','05:57','11:57','15:16','17:55','19:05'] },
    { range: [23, 31], times: ['04:41','05:57','11:56','15:17','17:53','19:04'] },
  ],
  November: [
    { range: [1, 7], times: ['04:41','05:59','11:56','15:17','17:51','19:03'] },
    { range: [8, 15], times: ['04:41','06:00','11:56','15:18','17:50','19:02'] },
    { range: [16, 21], times: ['04:42','06:02','11:57','15:19','17:50','19:03'] },
    { range: [22, 24], times: ['04:43','06:03','11:58','15:20','17:51','19:04'] },
    { range: [25, 27], times: ['04:45','06:05','11:59','15:21','17:51','19:05'] },
    { range: [28, 30], times: ['04:45','06:06','12:00','15:22','17:52','19:06'] },
  ],
  December: [
    { range: [1, 3], times: ['04:47','06:08','12:01','15:23','17:53','19:07'] },
    { range: [4, 6], times: ['04:48','06:09','12:02','15:24','17:54','19:08'] },
    { range: [7, 9], times: ['04:49','06:10','12:04','15:25','17:55','19:09'] },
    { range: [10, 11], times: ['04:50','06:12','12:05','15:26','17:56','19:11'] },
    { range: [12, 14], times: ['04:51','06:13','12:06','15:28','17:57','19:12'] },
    { range: [15, 16], times: ['04:53','06:15','12:07','15:29','17:58','19:14'] },
    { range: [17, 18], times: ['04:54','06:15','12:08','15:30','17:59','19:14'] },
    { range: [19, 20], times: ['04:54','06:16','12:09','15:30','18:00','19:15'] },
    { range: [21, 21], times: ['04:56','06:18','12:10','15:32','18:01','19:16'] },
    { range: [22, 25], times: ['04:56','06:18','12:11','15:32','18:02','19:17'] },
    { range: [26, 27], times: ['04:57','06:19','12:13','15:33','18:03','19:18'] },
    { range: [28, 29], times: ['04:59','06:21','12:14','15:35','18:04','19:19'] },
    { range: [30, 31], times: ['05:00','06:22','12:15','15:36','18:05','19:20'] },
  ],
};
