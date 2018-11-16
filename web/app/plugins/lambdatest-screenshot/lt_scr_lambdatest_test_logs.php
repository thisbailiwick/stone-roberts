<?php
    if (!defined('ABSPATH')) {
        exit;
    }
require_once 'lt_scr_lambdatest_config.php';
if (isset($_GET['test_id'])) {
    wp_register_style('lt_scr_lambdatest_screenshot_min_css', plugins_url('css/screenshot.min.css', __FILE__), array(), null);
    wp_enqueue_style('lt_scr_lambdatest_screenshot_min_css');
    ?>
            <script>
                jQuery(function() {
                    jQuery('#zoom_img2').show();
                    jQuery('#zoom_img').on('load', function(){
                        jQuery('#zoom_img2').hide();
                    });
                });
            </script>
        <?php
}
wp_register_style('lt_scr_lambdatest_test_logs_css', plugins_url('css/lt_scr_lambdatest_test_logs.css', __FILE__), array(), null);
wp_enqueue_style('lt_scr_lambdatest_test_logs_css');
?>
<div id="ltScrTestlogApp">
    <template>
        <?php
            if (isset($_GET['test_id'])) {
                include_once 'lt_scr_lambdatest_thumbnails.php';
                include_once 'lt_scr_lambdatest_screenshot_img_slider.php';
            } else {
                include_once 'lt_scr_lambdatest_test_log_page.php';
            }
        ?>
        <div class="main_loader" :class="{ display_none: is_loader_active === false}">
            <img src="<?php echo plugins_url( 'icons/loading_img.gif', __FILE__ ); ?>">
        </div>
    </template>
</div>
<?php
    function lt_scr_lambdatest_test_logs_script($lt_falcon_url,$lt_lums_url){
        ?>
            <script>
                var ltScrTestlogApp = new Vue({
                    el: '#ltScrTestlogApp',
                    data: {
                        is_loader_active:false,
                        devices:[],
                        metadata:{},
                        width:0,
                        height:0,
                        logs:[],
                        total_logs:0,
                        limit:50,
                        offset:0,
                        status:"all",
                        search_test:"",
                        screenshot_counter:0,
                        pingInterval:"",
                        test_log:{

                        },
                        response_json:{

                        },
                        slider_images:[
                        ],
                        img_slider_is_active:false,
                        zoom:'100%',
                        current_img:{

                        },
                        changeVal:""
                    },
                    created(){
                        this.getDevices();
                        this.getMetaData();
                        let test_id = `<?php echo isset($_GET['test_id']) ? sanitize_text_field(trim($_GET['test_id'])) : ''; ?>`;
                        if(test_id){
                            this.is_loader_active = true;
                            if(localStorage.getItem('lt_scr_access_token')){
                                this.getScreenshotOfTestId(test_id);
                            } else{
                                this.ltScrGetToken();
                                setTimeout(() => {
                                    this.getScreenshotOfTestId(test_id);
                                }, 2000);
                            }
                        } else{
                            this.getTestLogs();
                        }
                    },
                    methods: {
                        getDevices:function(){
                            axios.get(`<?php echo plugins_url( 'launchers/responsive.json', __FILE__ ); ?>`)
                            .then(function (response) {
                                this.devices = response.data;
                            }.bind(this))
                            .catch(function (error) {
                                alert(`${error.message}`);
                                window.location="<?php echo admin_url(); ?>admin.php?page=lt_scr_lambdatest_home_page";
                            }.bind(this));
                        },
                        getMetaData:function(){
                            axios.get(`<?php echo plugins_url( 'launchers/device-meta.json', __FILE__ ); ?>`)
                            .then(function (response) {
                                this.metadata = response.data;
                            }.bind(this))
                            .catch(function (error) {
                                alert(`${error.message}`);
                                window.location="<?php echo admin_url(); ?>admin.php?page=lt_scr_lambdatest_home_page";
                            }.bind(this));
                        },
                        getTestLogs:function(){
                            this.is_loader_active = true;
                            if(localStorage.getItem('lt_scr_access_token')){
                                axios.get(`<?php echo $lt_falcon_url;?>/user-tests/screenshot-responsive?limit=${this.limit}&offset=${this.offset}`, {
                                    headers: {
                                        "Content-type": "application/json",
                                        "Authorization":`Bearer ${localStorage.getItem('lt_scr_access_token')}`
                                    }
                                })
                                .then(function (response) {
                                    this.total_logs = response.data.tests.length;
                                    this.logs = response.data.tests.filter(function(log) {
                                        return log.test_type_id === 'Screenshot'
                                    });
                                    this.is_loader_active = false;
                                }.bind(this))
                                .catch(function (error) {
                                    if(error.response && error.response.status === 401){
                                        this.ltScrGetToken();                        
                                    }
                                }.bind(this));
                            } else{
                                this.ltScrGetToken();
                            }
                        },
                        ltScrGetToken:function(){
                            <?php
                            // Get Current User Detail..
                            global $wpdb;
                            $table_name = $wpdb->prefix . 'lt_src_lambdatest';
                            $row_1_sql = "SELECT * FROM " . $table_name . " WHERE id = 1";
                            $cur_user = $wpdb->get_row($row_1_sql);

                            if (isset($cur_user) && isset($cur_user->email) && is_email(sanitize_email(trim($cur_user->email))) && isset($cur_user->token) && sanitize_text_field(trim($cur_user->token))) {?>
                                axios.post('<?php echo $lt_lums_url;?>/api/user/auth/WordPress', {
                                    email: "<?php echo sanitize_email(trim($cur_user->email)); ?>",
                                    token: "<?php echo sanitize_text_field(trim($cur_user->token)); ?>"
                                }).then(function (response) {
                                    let authData = response.data;
                                    if(authData.type === 'success'){
                                        localStorage.setItem('lt_scr_access_token',authData.token);
                                        localStorage.setItem('lt_scr_organization_id',authData.user.organization_id);
                                        this.getTestLogs();
                                    }
                                }.bind(this))
                                .catch(function (error) {
                                    if(error.response && error.response.status === 401){
                                        alert(`Please activate LambdaTest Screenshot plugin by entering Access Token. Click Here to know how`);
                                        window.location="<?php echo admin_url(); ?>admin.php?page=lt_scr_lambdatest_home_page";
                                    }
                                }.bind(this));
                            <?php } else {?>
                                this.clearScreenshotInterval();
                                window.location="<?php echo admin_url(); ?>admin.php?page=lt_scr_lambdatest_home_page";
                            <?php }?>
                        },
                        getTestlLogDetail:function(log){
                            window.location=`<?php echo admin_url(); ?>admin.php?page=lt_scr_lambdatest_test_logs&test_id=${log.test_id}&url=${log.test_url}`;
                        },
                        logSliderImg:function(){
                            let deviceIndex = this.test_log.activities.findIndex(device => {
                                return (
                                    device.activity_id === this.logVal
                                )
                            });
                            if(deviceIndex > -1){
                                this.currentImg = this.test_log.activities[deviceIndex].screenshots[0].screenshot_url;
                            }
                        },
                        zoomChange:function(){
                            jQuery(`.log_img`).css('zoom',this.zoomVal);
                        },
                        getScreenshotOfTestId:function(test_id){
                            this.screenshot_counter = 0;
                            this.pingInterval = setInterval(() =>{
                                this.getScreenshots(test_id);
                            }, 4000);

                            // Clear Interval After 10 minute.
                            setInterval(()=> {
                                this.clearScreenshotInterval();
                            }, 600000);
                        },
                        getScreenshots:function (test_id){
                            if(this.screenshot_counter >= 36){
                                this.clearScreenshotInterval();
                            }
                            this.screenshot_counter++;

                            axios.get(`<?php echo $lt_falcon_url;?>/tests/${test_id}/screenshots`,{
                                headers: {
                                    "Content-type": "application/json; charset=UTF-8",
                                    "Authorization":`Bearer ${localStorage.getItem('lt_scr_access_token')}`
                                }
                            })
                            .then(function (response) {
                                let json = response.data;
                                if(json && json.completed_ind ==='completed'){
                                    this.clearScreenshotInterval();
                                }
                                if(json && json.output){
                                    this.response_json = json;
                                    this.is_loader_active = false;
                                    this.setImageSliderData(this.response_json);
                                }
                            }.bind(this))
                            .catch(function (error) {
                                this.is_loader_active = false;
                                if(error.response && error.response.status === 401){
                                    this.clearScreenshotInterval();
                                    alert(`Please activate LambdaTest Screenshot plugin by entering Access Token. Click Here to know how`);
                                    window.location="<?php echo admin_url(); ?>admin.php?page=lt_scr_lambdatest_home_page";
                                }
                            }.bind(this));
                        },
                        clearScreenshotInterval:function (){
                            if(this.pingInterval) clearInterval(this.pingInterval);
                        },
                        setImageSliderData:function(response_json){

                            if(Object.keys(response_json.output.desktop).length > 0){
                                for (let key in response_json.output.desktop) {

                                    response_json.output.desktop[key].forEach(element => {
                                        let deviceIndex = this.slider_images.findIndex(device => {
                                            return (
                                                device.activity_id === element.activity_id
                                            )
                                        });
                                        if(deviceIndex > -1){
                                            this.slider_images[deviceIndex] = {
                                                type:"desktop",
                                                resolution_id:element.resolution_id,
                                                activity_id:element.activity_id,
                                                browser_version:response_json.browsers[element.browser_id].name +' '+ response_json.browser_versions[element.browser_version_id].version_no+' '+ response_json.os_versions[element.os_version_id].name,
                                                screenshot_url:element.screenshots.length > 0 ? element.screenshots[0].screenshot_url : "",
                                                screenshot_img_loader:element.screenshots.length > 0 ? '' : 'screenshot_img_loader'
                                            }
                                        } else{
                                            this.slider_images.push({
                                                type:"desktop",
                                                resolution_id:element.resolution_id,
                                                activity_id:element.activity_id,
                                                browser_version:response_json.browsers[element.browser_id].name +' '+ response_json.browser_versions[element.browser_version_id].version_no+' '+ response_json.os_versions[element.os_version_id].name,
                                                screenshot_url:element.screenshots.length > 0 ? element.screenshots[0].screenshot_url : "",
                                                screenshot_img_loader:element.screenshots.length > 0 ? '' : 'screenshot_img_loader'
                                            })
                                        }
                                    });
                                }
                            }

                            if(response_json.output.ios.length > 0){
                                response_json.output.ios.forEach(element => {
                                    let deviceIndex = this.slider_images.findIndex(device => {
                                        return (
                                            device.activity_id === element.activity_id
                                        )
                                    });
                                    if(deviceIndex > -1){
                                        this.slider_images[deviceIndex] = {
                                            type:"ios",
                                            device_id:element.device_id,
                                            resolution_id:element.resolution_id,
                                            activity_id:element.activity_id,
                                            browser_version:response_json.os_versions[element.os_version_id].name +' '+ response_json.devices[element.device_id].name,
                                            screenshot_url:element.screenshots.length > 0 ? element.screenshots[0].screenshot_url : "",
                                            screenshot_img_loader:element.screenshots.length > 0 ? '' : 'screenshot_img_loader'
                                        }
                                    } else{
                                        this.slider_images.push({
                                            type:"ios",
                                            device_id:element.device_id,
                                            resolution_id:element.resolution_id,
                                            activity_id:element.activity_id,
                                            browser_version:response_json.os_versions[element.os_version_id].name +' '+ response_json.devices[element.device_id].name,
                                            screenshot_url:element.screenshots.length > 0 ? element.screenshots[0].screenshot_url : "",
                                            screenshot_img_loader:element.screenshots.length > 0 ? '' : 'screenshot_img_loader'
                                        })
                                    }
                                });
                            }

                            if(response_json.output.android.length > 0){
                                response_json.output.android.forEach(element => {
                                    let deviceIndex = this.slider_images.findIndex(device => {
                                        return (
                                            device.activity_id === element.activity_id
                                        )
                                    });
                                    if(deviceIndex > -1){
                                        this.slider_images[deviceIndex] = {
                                            type:"android",
                                            device_id:element.device_id,
                                            resolution_id:element.resolution_id,
                                            activity_id:element.activity_id,
                                            browser_version:response_json.os_versions[element.os_version_id].name +' '+ response_json.devices[element.device_id].name,
                                            screenshot_url:element.screenshots.length > 0 ? element.screenshots[0].screenshot_url : "",
                                            screenshot_img_loader:element.screenshots.length > 0 ? '' : 'screenshot_img_loader'
                                        }
                                    } else{
                                        this.slider_images.push({
                                            type:"android",
                                            device_id:element.device_id,
                                            activity_id:element.activity_id,
                                            resolution_id:element.resolution_id,
                                            browser_version:response_json.os_versions[element.os_version_id].name +' '+ response_json.devices[element.device_id].name,
                                            screenshot_url:element.screenshots.length > 0 ? element.screenshots[0].screenshot_url : "",
                                            screenshot_img_loader:element.screenshots.length > 0 ? '' : 'screenshot_img_loader'
                                        })
                                    }
                                });
                            }
                        },
                        startSliderImg:function(activity_id,img_urls){
                            if(img_urls){
                                if(jQuery(`#collapse-button`).attr('aria-label').includes(`Collapse`)){
                                    jQuery(`#collapse-button`).trigger( "click" );
                                }
                                this.img_slider_is_active = true;
                                if(this.slider_images.length > 0){
                                    let currIndex = this.slider_images.findIndex(device => {
                                        return (
                                            device.activity_id === activity_id
                                        )
                                    });
                                    if(currIndex > -1){
                                        this.current_img = this.slider_images[currIndex];
                                    } else{
                                        this.current_img = this.slider_images[0];
                                    }
                                    if(this.current_img.type != "desktop"){
                                        this.width = this.response_json.resolutions[this.current_img.resolution_id].width + 'px';
                                        this.height = this.response_json.resolutions[this.current_img.resolution_id].height + 'px';
                                    } else{
                                        this.width = '100%';
                                        this.height = '100%';
                                    }
                                    this.changeMonitorSize(13.3);
                                    this.changeVal = this.current_img.activity_id;
                                    if(this.current_img.screenshot_img_loader){
                                        jQuery(`#zoom_img`).addClass(`${this.current_img.screenshot_img_loader}`);
                                    }

                                    jQuery(`._thumbnails_container_`).addClass('display_none');
                                    jQuery(`.slider_img_container`).removeClass('display_none');
                                }
                            } else{
                                alert(`Please wait while image is loading..`);
                            }
                        },
                        onChangeImg:function(){
                            jQuery('#zoom_img2').show();
                            let deviceIndex = this.slider_images.findIndex(device => {
                                return (
                                    device.activity_id === this.changeVal
                                )
                            });
                            if(deviceIndex > -1){
                                this.current_img = this.slider_images[deviceIndex];
                                if(this.current_img.type != "desktop"){
                                    this.width = this.response_json.resolutions[this.current_img.resolution_id].width + 'px';
                                    this.height = this.response_json.resolutions[this.current_img.resolution_id].height + 'px';
                                } else{
                                    this.width = '100%';
                                    this.height = '100%';
                                    jQuery(`#zoom_img`).css('width',this.zoom);
                                }
                                if(this.current_img.screenshot_url.includes(`loading_img`)){
                                    jQuery(`#zoom_img`).addClass(`screenshot_img_loader`);
                                } else{
                                    jQuery(`#zoom_img`).removeClass(`screenshot_img_loader`);
                                }
                                this.changeMonitorSize(13.3);
                            }
                        },
                        onZoom:function(){
                            jQuery(`#zoom_img_container`).css('zoom',this.zoom);
                            if (this.current_img.type === 'desktop') {
                                jQuery(`#zoom_img`).css('width',this.zoom);
                            } else{
                                jQuery(`#zoom_img`).css('width',this.width -10);
                            }
                        },
                        pagination:function(_offset){
                            this.offset = this.offset + _offset;
                            this.getTestLogs();
                        },
                        getStatus:function(){
                            if(this.status === "all" || this.status === ""){
                                this.getTestLogs();
                            } else{
                                this.getTestLogs();
                                setTimeout(() => {
                                    this.logs = this.logs.filter((log) =>{
                                        return log.completed_ind === this.status;
                                    });  
                                }, 1000);
                            }

                        },
                        searchTest:function(){
                            this.getTestLogs();
                            setTimeout(() => {
                                if(this.search_test){
                                    let _search_test = this.search_test.toLowerCase();
                                    this.logs = this.logs.filter(function(log) {
                                        return log.test_id.toLowerCase().includes(`${_search_test}`) || log.test_url.toLowerCase().includes(`${_search_test}`);
                                    });
                                }
                            }, 1000);

                        },
                        imageLoadingComplate:function(){
                            jQuery('#zoom_img2').hide();
                        },
                        changeMonitorSize:function(size){
                            if (this.current_img.type !== 'desktop') {
                                const uw = window.screen.width;
                                const uh = window.screen.height;
                                let dh = this.devices[0].h;
                                let dp = this.devices[0].ppi;
                                
                                let deviceIndex = this.devices.findIndex(device => {
                                    return (
                                        device.device_id === this.current_img.device_id
                                    )
                                });
                                
                                if(deviceIndex > -1){
                                    dh = this.devices[deviceIndex].h;
                                    dp = this.devices[deviceIndex].ppi;
                                }
                                
                                const f2 = dh / dp;
                                const w = (uw / ((parseFloat(size) * uw / uh / Math.sqrt(1 + Math.pow(uw / uh, 2)))))*f2;
                                this.width = w;
                                jQuery('#zoom_img_container').width(w);
                                jQuery('#zoom_img').width(w-10);
                            }
                        }
                    }
                })
            </script>
        <?php
    }
    lt_scr_lambdatest_test_logs_script($lt_falcon_url,$lt_lums_url);
?>
