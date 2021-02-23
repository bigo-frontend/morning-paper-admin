<template>
  <div class="pape-wrap">
    <el-row :gutter="16">
      <el-col :span="16">
        <el-card v-for="group in paperList" :key="group.name" class="box-card" shadow="always">
          <div slot="header" class="clearfix">
            <span>{{ group.name }}</span>
          </div>
          <div class="channels">
            <el-button
              v-for="item in group.list"
              :key="item.href"
              class="btn-channel"
              type="primary"
              plain
              @click="handleClick(item)"
            >  {{ item.name }} </el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-form>
          <el-form-item
            :label-col="{ span: 24 }"
            label="业务类型"
            label-align="left"
          >
            <el-select v-model="token">
              <el-option
                v-for="item in bizTypes"
                :key="item.token"
                :label="item.name"
                :value="item.token"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label-col="{ span: 24 }"
            label="支持markdown输入"
            label-align="left"
          >
            <el-input
              v-model="content"
              type="textarea"
              placeholder="暂支持mardown语法"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSendMsg"> 发消息 </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-dialog
      :visible.sync="visible"
      custom-class="post-modal"
      title="文章列表"
    >
      <div v-loading="isLoading" class="post-list">
        <div :style="{ borderBottom: '1px solid #E9E9E9' }">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="indeterminate"
            @change="handleCheckAll"
          >全选</el-checkbox>
        </div>
        <br>
        <el-checkbox-group
          v-model="checkedList"
          @change="handleCheck"
        >
          <div v-for="item in checkoptions" :key="item.value">
            <el-checkbox :label="item.value">
              {{ item.name }}
            </el-checkbox>
            <a
              class="el-button--text"
              style="font-size: 14px;"
              target="_blank"
              :href="item.value"
              @click.stop
            > &nbsp; &nbsp;查看</a>
          </div>
        </el-checkbox-group>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="handleComfirm">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment';
import { channels, bizTypes } from '@/constant/paper';
import { getPostList, sendMsg } from '@/api/paper';

const chache = {};
export default {
  name: 'Paper',
  data() {
    return {
      paperList: channels,
      visible: false,
      postList: [],
      isLoading: false,
      checkedList: [],
      indeterminate: false,
      checkAll: false,
      currentChannel: '',
      bizTypes,
      token: '0b8d1427-70a6-4a6b-9639-510b089e69e9',
      preList: [], // 预备发布文章
      content: ''
    };
  },
  computed: {
    checkoptions() {
      return this.mapPostToOPtions(this.postList);
    },
    bizTypeName() {
      const biz = this.bizTypes.find((item) => item.value === this.token);
      return biz?.name || '';
    }
  },
  watch: {
    visible(newVal) {
      if (!newVal && this.isLoading) {
        this.isLoading = false;
      }
    },
    checkedList(newVal) {
      chache[this.currentChannel].checkedList = newVal;
    },
    token() {
      this.updateContent();
    }
  },
  methods: {
    async handleClick(item) {
      this.visible = true;
      const currentChannel = item.url;
      this.currentChannel = currentChannel;
      if (chache?.[currentChannel]?.list?.length > 0) {
        const list = chache[currentChannel].list;
        this.checkedList = chache[currentChannel].checkedList || [];
        this.postList = list;
        return list;
      }
      this.isLoading = true;
      this.postList = [];
      const [err, data] = await getPostList({ link: item.url, bizType: item.bizType, waitTime: 3000 });
      if (!err) {
        this.isLoading = false;
        const list = data.data || [];
        this.postList = list;
        chache[currentChannel] = {};
        chache[currentChannel].list = list;
      } else {
        this.$message.error('加载失败!');
      }
    },

    mapPostToOPtions(list) {
      return list.map((post) => {
        return { name: post.title, value: post.href };
      });
    },

    handleCheck(checkedList) {
      this.indeterminate =
        !!checkedList.length && checkedList.length < this.checkoptions.length;
      this.checkAll = checkedList.length === this.checkoptions.length;
    },

    handleCheckAll(isCheck) {
      const all = this.checkoptions.map((item) => item.value);
      Object.assign(this, {
        checkedList: isCheck ? all : [],
        indeterminate: false,
        checkAll: isCheck
      });
    },

    updateContent() {
      const date = moment().format('YYYY/MM/DD');
      const bizName = this.bizTypeName;
      const header = `<font color=\"#389e0d\">${bizName}早报-${date}</font>，欢迎大家阅读。\n>`;
      const systemName = 'bigo前端';
      const tail = `本服务由**${systemName}**提供技术支持`;
      const body = this.preList
        .map((item, index) => `#### ${index + 1}. ${item}`)
        .join('\n');
      this.content = `${header}***\n${body}\n***\n${tail}`;
    },

    handleComfirm() {
      this.visible = false;
      const selectedPosts = this.postList.filter((item) =>
        this.checkedList.includes(item.href)
      );
      const selectedList = selectedPosts.map((item, index) => {
        return `[${item.title.trim()}](${item.href})`;
      });
      this.preList = [...new Set([...this.preList, ...selectedList])];
      this.updateContent();
    },

    async handleSendMsg() {
      const params = {
        content: this.content,
        token: this.token
      };
      const [err] = await sendMsg(params);
      if (!err) {
        this.$message.success('发送成功!');
      } else {
        this.$message.error('发送失败!');
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.pape-wrap {
  padding: 30px 20px;
}
.box-card:not(:first-of-type) {
  margin-top: 30px;
}
::v-deep {
  .btn-channel {
    margin-bottom: 16px;
  }

  .post-modal {
    font-size: 14px;
    line-height: 1.5;

    .post-list {
        height: 300px;
        overflow-y: auto;
      }
    }
}
</style>
