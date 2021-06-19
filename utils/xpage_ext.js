/**
 * 扩展基本方法
 */
class XPageExt {
	reloadData(vm){
		let pages =getCurrentPages();//当前页面栈
		if (pages.length >1) {
				var beforePage = pages[pages.length- 2];//获取上一个页面实例对象
				beforePage.broadcastUpdate();//触发父页面中的方法
		}
	}
	
}