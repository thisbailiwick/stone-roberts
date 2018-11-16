<?php
    if (!defined('ABSPATH')) {
        exit;
    }
?>
<div class="logs col-sm-12 wrap">
    <h1 class="wp-heading-inline">Test Logs</h1>
    <p class="search-box">
    <label class="screen-reader-text" for="post-search-input">Search Test:</label>
    <input type="search" v-model="search_test">
    <input type="button" id="search-submit" class="button" value="Search Test" @click="searchTest()">
</p>
<div class="tablenav top">
    <div class="alignleft actions">
        <label class="screen-reader-text" for="cat">Filter by Test Logs</label>
        <select name="cat" id="cat" class="postform" v-model="status">
            <option value="all">All</option>
            <option value="started">In progress</option>
            <option value="completed">Completed</option>
        </select>
        <input type="submit" name="filter_action" id="post-query-submit" class="button" value="Filter" @click="getStatus()">
    </div>
    <h2 class="screen-reader-text">Posts list navigation</h2>
    <div class="tablenav-pages">
        <div class="alignleft actions bulkactions">
        </div>
        <div class="alignleft actions">
        </div>
        <div class="tablenav-pages">
            <span class="pagination-links">
                <a v-if="offset > 0" class="prev-page" @click="pagination(-1)" href="javascript:void(0)"><span class="screen-reader-text">Previous page</span>
                    <span aria-hidden="true">‹</span>
                </a>
                <span class="screen-reader-text">Current Page</span><span id="table-paging" class="paging-input"><span class="tablenav-paging-text">&nbsp;&nbsp;&nbsp;<span class="total-pages">&nbsp;&nbsp;&nbsp;</span></span></span>
                <a v-if="total_logs === 50" class="next-page" @click="pagination(1)" href="javascript:void(0)"><span class="screen-reader-text">Next page</span><span aria-hidden="true">›</span></a>
            </span>
        </div>
    </div>
    <br class="clear">
</div>



    <table class="wp-list-table widefat fixed striped">
        <thead>
            <tr>
                <th scope="col" style="width:100px" class="manage-column">Number</th>
                <th scope="col" class="manage-column">Test ID</th>
                <th scope="col" class="manage-column">URL</th>
                <th scope="col" class="manage-column ">Date</th>
                <th scope="col" class="manage-column">Screenshot #</th>
                <th scope="col" class="manage-column">Status</th>
            </tr>
        </thead>

        <tbody id="the-list">
            <tr style="cursor: pointer;color: #0073aa;" v-for="(log,index) in logs" :key="index" @click="getTestlLogDetail(log)">
                <th scope="col" style="width:100px" class="manage-column">{{offset*50 + index + 1}}</th>
                <th scope="col" class="manage-column">{{log.test_id}}</th>
                <th scope="col" class="manage-column">{{log.test_url}}</th>
                <th scope="col" class="manage-column">{{log.start_timestamp}}</th>
                <th scope="col" class="manage-column">{{log.screenshot_count}}</th>
                <th scope="col" class="manage-column">{{log.completed_ind}}</th>
            </tr>
        </tbody>
    </table>
</div>


<div class="col-sm-12">
    <div class="tablenav bottom">
        <div class="alignleft actions bulkactions">
        </div>
        <div class="alignleft actions">
        </div>
        <div class="tablenav-pages">
            <span class="pagination-links">
                <a v-if="offset > 0" class="prev-page" @click="pagination(-1)" href="javascript:void(0)"><span class="screen-reader-text">Previous page</span>
                    <span aria-hidden="true">‹</span>
                </a>
                <span class="screen-reader-text">Current Page</span><span id="table-paging" class="paging-input"><span class="tablenav-paging-text">&nbsp;&nbsp;&nbsp;<span class="total-pages">&nbsp;&nbsp;&nbsp;</span></span></span>
                <a v-if="total_logs === 50" class="next-page" @click="pagination(1)" href="javascript:void(0)"><span class="screen-reader-text">Next page</span><span aria-hidden="true">›</span></a>
            </span>
        </div>
        <br class="clear">
    </div>
</div>
