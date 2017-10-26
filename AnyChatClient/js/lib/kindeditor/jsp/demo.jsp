<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
request.setCharacterEncoding("UTF-8");
String htmlData = request.getParameter("content1") != null ? request.getParameter("content1") : "";
%>
<!doctype html>
<html>
<head>
	<meta charset="utf-8" />
	<title>KindEditor JSP</title>
	<link rel="stylesheet" href="../themes/default/default.css" />
	<link rel="stylesheet" href="../plugins/code/prettify.css" />
	<script charset="utf-8" src="../kindeditor.js"></script>
	<script charset="utf-8" src="../lang/zh_CN.js"></script>
	<script charset="utf-8" src="../plugins/code/prettify.js"></script>
	<script>
	
	var editor1="";
		KindEditor.ready(function(K) {
			editor1 = K.create('textarea[name="content1"]', {
				cssPath : '../plugins/code/prettify.css',
				items : [
				 		'source', '|', 'undo', 'redo', '|', 'preview', 'cut', 'copy', 'paste',
				 		'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
				 		'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
				 		'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/',
				 		'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
				 		'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'multiimage',
				 		'flash', 'media', 'insertfile', 'table', 'hr', 'emoticons', 'baidumap', 'pagebreak',
				 		'anchor', 'link', 'unlink', '|'
				 	],
				minHeight : 300,
				uploadJson : '../jsp/upload_json.jsp',
				fileManagerJson : '../jsp/file_manager_json.jsp',
				allowFileManager : true
				//afterCreate : function() {
				//	var self = this;
				//	K.ctrl(document, 13, function() {
				//		self.sync();
				//		document.forms['example'].submit();
				//	});
				//	K.ctrl(self.edit.doc, 13, function() {
				//		self.sync();
				//		document.forms['example'].submit();
				//	});
				//}
			});
			prettyPrint();
		});
		function check(){
			document.example.content.value=editor1.html();
			alert(document.example.content.value);
			document.forms['example'].submit();
		}
		
	</script>
</head>
<body>
	<%=htmlData%>
	<form name="example" id="example" method="post" action="demo.jsp">
	<input type="text" name="content" id="content" value="">
		<textarea name="content1" cols="100" rows="8" style="width:700px;height:200px;visibility:hidden;"><%=htmlspecialchars(htmlData)%></textarea>
		<br />
		<input type="submit" name="button" value="提交内容" onclick="check();" /> (提交快捷键: Ctrl + Enter)
	</form>
</body>
</html>
<%!
private String htmlspecialchars(String str) {
	str = str.replaceAll("&", "&amp;");
	str = str.replaceAll("<", "&lt;");
	str = str.replaceAll(">", "&gt;");
	str = str.replaceAll("\"", "&quot;");
	return str;
}
%>