<?php
    if (!defined('ABSPATH')) {
        exit;
    }
?>
<div class="col-sm-12 slider_img_container display_none" v-if="slider_images.length > 0">
    <div class="col-sm-12" style="height: 56px;background-color: #ffffff; padding-top: 12px;margin-bottom: 10px;">
        <div class="col-sm-2">
            <button type="button" class="btn btn-default active-btn" onclick="location.reload(false);">
                Back
            </button>
            <div class="resultDown" style="    margin-top: 8px;padding-left: 21px;">
                <a  v-if="current_img.screenshot_url && current_img.screenshot_url.indexOf('loading_img') < 0" class="iconDown" :href="current_img.screenshot_url" target="_blank" download></a>
                <a class="iconDown" v-else></a>
            </div>
        </div>
        <div class="col-md-10">
            <div class="col-sm-4">
                <select class="form-control" v-model="changeVal" @change="onChangeImg()">
                    <option v-for="(img_element,index) in slider_images" :key="index" :value="img_element.activity_id">{{img_element.browser_version}}</option>
                </select>
            </div>
            <div class="col-sm-3">
                <select class="form-control" v-model="zoom" @change="onZoom()">
                    <option value="25%">25%</option>
                    <option value="50%">50%</option>
                    <option value="75%">75%</option>
                    <option value="100%">100%</option>
                    <option value="150%">150%</option>
                </select>
            </div>
            <div class="col-sm-5">
                URL : &nbsp; &nbsp;<a href="<?php echo isset($_GET['url']) ? esc_attr($_GET['url']) : ''; ?>" target="_blank"><?php echo isset($_GET['url']) ? esc_html($_GET['url']) : ''; ?> </a>
            </div>
        </div>
    </div>
    <div class="col-sm-12" style="display:table-cell;vertical-align: middle;text-align: center;">
        <div id="zoom_img_container" :style="{width:width,height:height}" style="margin-left: 0px;margin: auto;overflow-y:scroll;">
            <img :src="current_img.screenshot_url" id="zoom_img" @load="imageLoadingComplate()">
            <img class="screenshot_img_loader" src="<?php echo plugins_url( 'icons/loading_img.gif', __FILE__ );?>" id="zoom_img2">
        </div>
    </div>
</div>
