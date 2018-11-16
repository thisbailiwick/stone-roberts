<?php
	if (!defined('ABSPATH')) {
		exit;
	}
	function lt_scr_lambdatest_add_icons_to_pages_posts(){
		?>
			<script>
				function lt_scr_lambdatest_get_page_url(index,lt_src_currnet_page){
					if(lt_src_currnet_page === 'lt_scr_detail_page'){
						localStorage.setItem('lt_scr_current_url',document.querySelector(`#sample-permalink a`).getAttribute('href'));						
					} else{
						let lt_scr_pages = JSON.parse(localStorage.getItem('lt_scr_pages'));
						if(lt_scr_pages && lt_scr_pages.length){
							if(lt_scr_pages[index].lt_scr_is_disable === "0"){
								alert(`Please publish this Page for Test`);
							} else{
								localStorage.setItem('lt_scr_current_url',lt_scr_pages[index].lt_scr_page_link);
							}
						}
					}
					window.location="<?php echo admin_url(); ?>admin.php?page=lt_scr_lambdatest_screenshot_page";
				}
				document.addEventListener("DOMContentLoaded", function(event) { 
					window.onresize = function() {
						if(window.innerHeight < 800){
							document.getElementsByTagName("body")[0].style ="overflow-x:inherit";
						}
					}
                    let lt_src_pages = [];
					document.querySelectorAll(`div.row-actions`).forEach(function(el) {
						lt_src_pages.push({
							lt_scr_title:el.querySelector('.view a').getAttribute('aria-label').substr(el.querySelector('.view a').getAttribute('aria-label').indexOf(" ") + 1).replace(/“/g, ""),
							lt_scr_page_link:el.querySelector('.view a').getAttribute('href'),
							lt_scr_is_disable:el.querySelector('.view a').innerText === "View" ? "1" :"0"
						});
					});
					localStorage.setItem('lt_scr_pages', JSON.stringify(lt_src_pages));
                    
					<?php
						global $pagenow;
						if (($pagenow === "edit.php") || $pagenow === "edit.php" && isset($_GET['post_type']) && sanitize_text_field(trim($_GET['post_type'])) === "page") {
							?>
							document.querySelectorAll(`div.row-actions`).forEach(function(el,index) {
								el.innerHTML +=`|
									<button type="button"
										style="border: none;background-color: transparent;"
										onclick="lt_scr_lambdatest_get_page_url(${index},null)"
									>
									<img class="svg" width="20" height="20" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAS9QTFRFAAAADrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrF////zovT6AAAAGR0Uk5TAAAIWNnTUQcCMqTmqq6dLQEehuPDTwlVyOF+GmBuEhV13c8FMOScIiem3iY34kADBEzfKz8fiaI2ctfLhyBF2hS3/tVpEA5Tpb2Nv0hbpzis59ApM8m7Fwx4VBYbL6DpBoKjWQJY7T8AAAABYktHRGTC2rgJAAAACXBIWXMAAABIAAAASABGyWs+AAAA1UlEQVQY003PZ3fBABgF4PcKDdIStCFFjRodUbtDqZgNYlXRpYP//x8kMU7vx+cd51wiIsDEmC0HLGgTWG127vCIczh5GGOX23N8wgpen3jqB4gNWMzBM2gJhSNR5pxi8UQSxjX4i8ura5JSN0A6YxiyuTxJYgHF27t7K/7BQ+kxVa5ob56qGwi55Fq90Wyh/ew3QPundLpcT5X6ph0MlPRwNH7JTeiVK8vQgYfgnc7m9PYu+j4E6AB8funbi++f0UJR+F03wq/a+7MvsQetn5zvrrawBse6HUSAQXCwAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTA4LTA5VDA3OjQ4OjAxKzAwOjAws3BMTgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0wOC0wOVQwNzo0ODowMSswMDowMMIt9PIAAABGdEVYdHNvZnR3YXJlAEltYWdlTWFnaWNrIDYuNy44LTkgMjAxNC0wNS0xMiBRMTYgaHR0cDovL3d3dy5pbWFnZW1hZ2ljay5vcmfchu0AAAAAGHRFWHRUaHVtYjo6RG9jdW1lbnQ6OlBhZ2VzADGn/7svAAAAGHRFWHRUaHVtYjo6SW1hZ2U6OmhlaWdodAAxOTIPAHKFAAAAF3RFWHRUaHVtYjo6SW1hZ2U6OldpZHRoADE5MtOsIQgAAAAZdEVYdFRodW1iOjpNaW1ldHlwZQBpbWFnZS9wbmc/slZOAAAAF3RFWHRUaHVtYjo6TVRpbWUAMTUwMjI2NDg4MVA6elUAAAAPdEVYdFRodW1iOjpTaXplADBCQpSiPuwAAABWdEVYdFRodW1iOjpVUkkAZmlsZTovLy9tbnRsb2cvZmF2aWNvbnMvMjAxNy0wOC0wOS8wZWI2MWIzN2NiNGYzNzA4MWFmN2FlN2IzNWEyZmJhNy5pY28ucG5nQ3QEXgAAAABJRU5ErkJggg==" >
									</button>
								`;
							})
							<?php }if ($pagenow === "post.php" && isset($_GET['post']) && isset($_GET['action']) && sanitize_text_field(trim($_GET['action'])) === "edit") {
						?>
						document.getElementById(`save-action`).innerHTML += `<button type="button"
								style="border: none;background-color: transparent;position: absolute;left: 108px;top: 14px;"
								onclick="lt_scr_lambdatest_get_page_url(0,'lt_scr_detail_page')"
							>
							<img class="svg" width="20" height="20" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAS9QTFRFAAAADrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrF////zovT6AAAAGR0Uk5TAAAIWNnTUQcCMqTmqq6dLQEehuPDTwlVyOF+GmBuEhV13c8FMOScIiem3iY34kADBEzfKz8fiaI2ctfLhyBF2hS3/tVpEA5Tpb2Nv0hbpzis59ApM8m7Fwx4VBYbL6DpBoKjWQJY7T8AAAABYktHRGTC2rgJAAAACXBIWXMAAABIAAAASABGyWs+AAAA1UlEQVQY003PZ3fBABgF4PcKDdIStCFFjRodUbtDqZgNYlXRpYP//x8kMU7vx+cd51wiIsDEmC0HLGgTWG127vCIczh5GGOX23N8wgpen3jqB4gNWMzBM2gJhSNR5pxi8UQSxjX4i8ura5JSN0A6YxiyuTxJYgHF27t7K/7BQ+kxVa5ob56qGwi55Fq90Wyh/ew3QPundLpcT5X6ph0MlPRwNH7JTeiVK8vQgYfgnc7m9PYu+j4E6AB8funbi++f0UJR+F03wq/a+7MvsQetn5zvrrawBse6HUSAQXCwAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTA4LTA5VDA3OjQ4OjAxKzAwOjAws3BMTgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0wOC0wOVQwNzo0ODowMSswMDowMMIt9PIAAABGdEVYdHNvZnR3YXJlAEltYWdlTWFnaWNrIDYuNy44LTkgMjAxNC0wNS0xMiBRMTYgaHR0cDovL3d3dy5pbWFnZW1hZ2ljay5vcmfchu0AAAAAGHRFWHRUaHVtYjo6RG9jdW1lbnQ6OlBhZ2VzADGn/7svAAAAGHRFWHRUaHVtYjo6SW1hZ2U6OmhlaWdodAAxOTIPAHKFAAAAF3RFWHRUaHVtYjo6SW1hZ2U6OldpZHRoADE5MtOsIQgAAAAZdEVYdFRodW1iOjpNaW1ldHlwZQBpbWFnZS9wbmc/slZOAAAAF3RFWHRUaHVtYjo6TVRpbWUAMTUwMjI2NDg4MVA6elUAAAAPdEVYdFRodW1iOjpTaXplADBCQpSiPuwAAABWdEVYdFRodW1iOjpVUkkAZmlsZTovLy9tbnRsb2cvZmF2aWNvbnMvMjAxNy0wOC0wOS8wZWI2MWIzN2NiNGYzNzA4MWFmN2FlN2IzNWEyZmJhNy5pY28ucG5nQ3QEXgAAAABJRU5ErkJggg==" >
							</button>`;
					<?php }?>
				});
			</script>
		<?php
	}
	lt_scr_lambdatest_add_icons_to_pages_posts();
?>




