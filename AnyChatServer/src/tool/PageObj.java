package tool;

public class PageObj {
	public int start;
	public int end;
	public int allNum;
	public int totalPage;
	public int currentPage;
	public int pageSize;

	public PageObj(int start, int end, int allNum, int totalPage, int currentPage, int pageSize) {
		this.start = start;
		this.end = end;
		this.allNum = allNum;
		this.totalPage = totalPage;
		this.currentPage = currentPage;
		this.pageSize = pageSize;
	}
}
