<?php
if (!defined('ABSPATH')) {
    exit;
}
/**
 * @package LambdaTest Screenshot
 * @version 1.1.3
 */
/*
Plugin Name: LambdaTest Screenshot
Plugin URI: https://wordpress.org/plugins/lambdatest-screenshot
Description: Find out browser compatibility issues. Use LambdaTest Screenshot Wordpress plugin to take full page screenshots of post and pages across different desktop and mobile browsers right from wordpress admin panels.
Author: LambdaTest.com
Version: 1.1.3
Author URI: https://www.lambdatest.com/support
 */
if(is_admin()){
    global $lt_scr_lambdatest_db_version;
        $lt_scr_lambdatest_db_version = '1.1.3';
        function lt_scr_install()
        {
            global $wpdb;
            $charset_collate = $wpdb->get_charset_collate();
            $table_name = $wpdb->prefix . 'lt_src_lambdatest';
            $sql = "CREATE TABLE IF NOT EXISTS $table_name (
                id mediumint(9) NOT NULL AUTO_INCREMENT,
                time datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
                email varchar(255) DEFAULT '' NOT NULL,
                token varchar(255) DEFAULT '' NOT NULL,
                verified smallint(1) DEFAULT 0 NOT NULL,
                PRIMARY KEY  (id)
            ) $charset_collate;";
            require_once ABSPATH . 'wp-admin/includes/upgrade.php';
            dbDelta($sql);
            global $lt_scr_lambdatest_db_version;
            $lt_scr_lambdatest_db_version = '1.1.3';
            add_option('lt_scr_lambdatest_db_version', $lt_scr_lambdatest_db_version);
        }
        register_activation_hook(__FILE__, 'lt_scr_install');
        function lt_scr_update_db_check()
        {
            global $lt_scr_lambdatest_db_version;
            if (get_site_option('lt_scr_lambdatest_db_version') != $lt_scr_lambdatest_db_version) {
                lt_scr_install();
            }
        }
        add_action('plugins_loaded', 'lt_scr_update_db_check');
        function lt_scr_lambdatest_menu()
        {
            $lt_scr_lambdatest_home_page_menu = add_menu_page(
                'LambdaTest',
                'LambdaTest',
                'read',
                "lt_scr_lambdatest_home_page",
                'lt_scr_lambdatest_home_page',
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAS9QTFRFAAAADrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrFDrrF////zovT6AAAAGR0Uk5TAAAIWNnTUQcCMqTmqq6dLQEehuPDTwlVyOF+GmBuEhV13c8FMOScIiem3iY34kADBEzfKz8fiaI2ctfLhyBF2hS3/tVpEA5Tpb2Nv0hbpzis59ApM8m7Fwx4VBYbL6DpBoKjWQJY7T8AAAABYktHRGTC2rgJAAAACXBIWXMAAABIAAAASABGyWs+AAAA1UlEQVQY003PZ3fBABgF4PcKDdIStCFFjRodUbtDqZgNYlXRpYP//x8kMU7vx+cd51wiIsDEmC0HLGgTWG127vCIczh5GGOX23N8wgpen3jqB4gNWMzBM2gJhSNR5pxi8UQSxjX4i8ura5JSN0A6YxiyuTxJYgHF27t7K/7BQ+kxVa5ob56qGwi55Fq90Wyh/ew3QPundLpcT5X6ph0MlPRwNH7JTeiVK8vQgYfgnc7m9PYu+j4E6AB8funbi++f0UJR+F03wq/a+7MvsQetn5zvrrawBse6HUSAQXCwAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTA4LTA5VDA3OjQ4OjAxKzAwOjAws3BMTgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0wOC0wOVQwNzo0ODowMSswMDowMMIt9PIAAABGdEVYdHNvZnR3YXJlAEltYWdlTWFnaWNrIDYuNy44LTkgMjAxNC0wNS0xMiBRMTYgaHR0cDovL3d3dy5pbWFnZW1hZ2ljay5vcmfchu0AAAAAGHRFWHRUaHVtYjo6RG9jdW1lbnQ6OlBhZ2VzADGn/7svAAAAGHRFWHRUaHVtYjo6SW1hZ2U6OmhlaWdodAAxOTIPAHKFAAAAF3RFWHRUaHVtYjo6SW1hZ2U6OldpZHRoADE5MtOsIQgAAAAZdEVYdFRodW1iOjpNaW1ldHlwZQBpbWFnZS9wbmc/slZOAAAAF3RFWHRUaHVtYjo6TVRpbWUAMTUwMjI2NDg4MVA6elUAAAAPdEVYdFRodW1iOjpTaXplADBCQpSiPuwAAABWdEVYdFRodW1iOjpVUkkAZmlsZTovLy9tbnRsb2cvZmF2aWNvbnMvMjAxNy0wOC0wOS8wZWI2MWIzN2NiNGYzNzA4MWFmN2FlN2IzNWEyZmJhNy5pY28ucG5nQ3QEXgAAAABJRU5ErkJggg=='
            );
            $lt_scr_lambdatest_screenshot_page_submenu = add_submenu_page(
                'lt_scr_lambdatest_home_page',
                'Screenshot',
                'Screenshot',
                'read',
                'lt_scr_lambdatest_screenshot_page',
                'lt_scr_lambdatest_screenshot_page'
            );
            $lt_scr_lambdatest_test_log_submenu = add_submenu_page(
                'lt_scr_lambdatest_home_page',
                'Test Logs',
                'Test Logs',
                'read',
                'lt_scr_lambdatest_test_logs',
                'lt_scr_lambdatest_test_logs'
            );
    
            add_action( 'admin_print_styles-' . $lt_scr_lambdatest_home_page_menu, 'lt_scr_lambdatest_styles' );
            add_action( 'admin_print_scripts-' . $lt_scr_lambdatest_home_page_menu, 'lt_scr_lambdatest_scripts' );
    
            add_action( 'admin_print_styles-' . $lt_scr_lambdatest_screenshot_page_submenu, 'lt_scr_lambdatest_styles' );
            add_action( 'admin_print_scripts-' . $lt_scr_lambdatest_screenshot_page_submenu, 'lt_scr_lambdatest_scripts' );
    
            add_action( 'admin_print_styles-' . $lt_scr_lambdatest_test_log_submenu, 'lt_scr_lambdatest_styles' );
            add_action( 'admin_print_scripts-' . $lt_scr_lambdatest_test_log_submenu, 'lt_scr_lambdatest_scripts' );
        }
    
        add_action('admin_menu', 'lt_scr_lambdatest_menu');
        function lt_scr_lambdatest_home_page()
        {
            require_once 'lt_scr_lambdatest_home_page.php';
        }
        function lt_scr_lambdatest_screenshot_page()
        {
            require_once 'lt_scr_lambdatest_screenshot_page.php';
        }
        function lt_scr_lambdatest_test_logs()
        {
            require_once 'lt_scr_lambdatest_test_logs.php';
        }
    
        function lt_scr_lambdatest_scripts()
        {
            wp_enqueue_script( 'jquery' );  
            wp_enqueue_script('lt_scr_lambdatest_vue_min_js', plugins_url('js/vue.min.js', __FILE__), array(), null);
            wp_enqueue_script('lt_scr_lambdatest_axios_min_js', plugins_url('js/axios.min.js', __FILE__), array(), null);
            wp_enqueue_script('lt_scr_lambdatest_bootstrap_min_js', plugins_url('js/bootstrap.min.js', __FILE__), array('jquery'), null);
        }
    
        function lt_scr_lambdatest_styles()
        {
            wp_register_style('lt_scr_lambdatest_bootstrap_min_css', plugins_url('css/bootstrap.min.css', __FILE__), array(), null);
            wp_enqueue_style('lt_scr_lambdatest_bootstrap_min_css');
            wp_register_style('lt_scr_lambdatest_native_divice_min_css', plugins_url('css/native-divice.min.css', __FILE__), array(), null);
            wp_enqueue_style('lt_scr_lambdatest_native_divice_min_css');
        }
}
add_action( 'plugins_loaded', 'lt_scr_lambdatest_check_current_user' );
function lt_scr_lambdatest_check_current_user() {
    if(current_user_can( 'read' )){
        global $pagenow;
        if (($pagenow === "edit.php") || ($pagenow === "edit.php" && isset($_GET['post_type']) && $_GET['post_type'] === "page") || ($pagenow === "post.php" && isset($_GET['post']) && isset($_GET['action']) && sanitize_text_field(trim($_GET['action'])) === "edit")) {
            include_once 'lt_scr_lambdatest_config.php';
            include_once 'lt_scr_lambdatest_add_icons.php';
        }
    }
}

