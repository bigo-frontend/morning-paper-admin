<template>
  <div>
    <el-upload
      class="picture-uploader"
      :limit="1"
      action="#"
      list-type="picture-card"
      :auto-upload="false"
      :file-list="fileList"
      :on-change="handleUpload"
      :style="{width}"
      v-bind="$attrs"
      :class="{'disabled': disabled}"
    >
      <i class="el-icon-plus" />
      <div slot="file" slot-scope="{file}">
        <div v-if="file">
          <img
            class="el-upload-list__item-thumbnail"
            :src="file.url"
            alt=""
          >
          <span class="el-upload-list__item-actions">
            <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
            >
              <i class="el-icon-zoom-in" />
            </span>
            <span
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
            >
              <i class="el-icon-delete" />
            </span>
          </span>
        </div>
      </div>
    </el-upload>
    <el-dialog :modal="false" :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import uploadFile from '@/mixins/upload-file';
export default {
  name: 'UploadFile',
  mixins: [uploadFile],
  inheritAttrs: false,
  props: {
    width: {
      type: [String, Boolean],
      default: '200px'
    },
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false
    };
  },
  computed: {
    fileList() {
      if (this.value) {
        const fileName = this.value.replace(/(.*\/)*([^.]+).*/ig, '$2');
        return [{
          uid: this.value,
          name: fileName,
          url: this.value
        }];
      } else {
        return [];
      }
    },
    disabled() {
      return !!this.value;
    }
  },
  methods: {
    handleRemove() {
      this.$emit('update:value', '');
    },
    handleUpload({ raw }, fileList) {
      fileList.pop();
      this.uploadFile(raw).then((url) => {
        this.$emit('update:value', url);
      }).catch((err) => {
        console.log(err);
        this.$nextTick(() => {
          this.$emit('update:value', '');
        });
      });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.disabled {
  ::v-deep .el-upload {
    display: none;
  }
}
</style>
