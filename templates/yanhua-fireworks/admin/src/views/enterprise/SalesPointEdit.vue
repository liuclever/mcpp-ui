<template>
  <div class="sales-point-edit">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑网点' : '新增网点' }}</span>
          <el-button @click="handleBack">返回列表</el-button>
        </div>
      </template>

      <el-form 
        ref="formRef" 
        :model="form" 
        :rules="rules" 
        label-width="120px"
        class="edit-form"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="网点名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入网点名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="省份" prop="province">
              <el-select 
                v-model="form.province" 
                placeholder="请选择省份" 
                filterable
                @change="handleProvinceChange"
              >
                <el-option 
                  v-for="province in provinceList" 
                  :key="province" 
                  :label="province" 
                  :value="province" 
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="城市" prop="city">
              <el-select 
                v-model="form.city" 
                placeholder="请选择城市" 
                filterable
                @change="handleCityChange"
              >
                <el-option 
                  v-for="city in cityList" 
                  :key="city" 
                  :label="city" 
                  :value="city" 
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="区县">
              <el-input v-model="form.district" placeholder="请输入区县（选填）" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="详细地址" prop="address">
          <el-input 
            v-model="form.address" 
            placeholder="请输入详细地址"
            @blur="handleAddressBlur"
          >
            <template #append>
              <el-button @click="handleGeocode" :loading="geocoding">
                获取坐标
              </el-button>
            </template>
          </el-input>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="纬度" prop="latitude">
              <el-input-number 
                v-model="form.latitude" 
                :precision="7" 
                :step="0.0001"
                :min="-90"
                :max="90"
                placeholder="纬度"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经度" prop="longitude">
              <el-input-number 
                v-model="form.longitude" 
                :precision="7" 
                :step="0.0001"
                :min="-180"
                :max="180"
                placeholder="经度"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 地图选点区域 -->
        <el-form-item label="地图选点">
          <div class="map-container">
            <div class="map-placeholder" v-if="!mapLoaded">
              <el-icon :size="48"><Location /></el-icon>
              <p>地图加载中...</p>
              <p class="map-tip">您也可以手动输入经纬度坐标</p>
            </div>
            <div id="map" class="map" v-show="mapLoaded"></div>
            <div class="map-actions" v-if="mapLoaded">
              <el-button size="small" @click="locateOnMap">定位到当前坐标</el-button>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="营业时间">
          <el-input v-model="form.businessHours" placeholder="例如：09:00-18:00" />
        </el-form-item>

        <el-form-item label="网点图片">
          <el-upload
            v-model:file-list="imageList"
            :action="uploadUrl"
            :headers="uploadHeaders"
            list-type="picture-card"
            :on-success="handleUploadSuccess"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            :limit="5"
          >
            <el-icon><Plus /></el-icon>
            <template #tip>
              <div class="el-upload__tip">
                最多上传5张图片，支持jpg/png格式，单张不超过5MB
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item label="启用状态">
          <el-switch
            v-model="form.enabled"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="saving">
            {{ isEdit ? '保存修改' : '创建网点' }}
          </el-button>
          <el-button @click="handleBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Location } from '@element-plus/icons-vue'
import { 
  getSalesPointDetail, 
  createSalesPoint, 
  updateSalesPoint, 
  geocodeAddress 
} from '@/api/sales-point'
import type { SalesPoint } from '@/api/sales-point'
import type { UploadFile, UploadUserFile } from 'element-plus'

const route = useRoute()
const router = useRouter()
const formRef = ref()
const saving = ref(false)
const geocoding = ref(false)
const mapLoaded = ref(false)
let map: any = null
let marker: any = null

const isEdit = computed(() => !!route.query.id)

const form = reactive<SalesPoint>({
  name: '',
  province: '',
  city: '',
  district: '',
  address: '',
  latitude: 28.2345,
  longitude: 112.9876,
  phone: '',
  businessHours: '',
  images: '',
  enabled: 1
})

const imageList = ref<UploadUserFile[]>([])

const rules = {
  name: [{ required: true, message: '请输入网点名称', trigger: 'blur' }],
  province: [{ required: true, message: '请选择省份', trigger: 'change' }],
  city: [{ required: true, message: '请选择城市', trigger: 'change' }],
  address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
  latitude: [{ required: true, message: '请输入纬度', trigger: 'blur' }],
  longitude: [{ required: true, message: '请输入经度', trigger: 'blur' }]
}

// 省份列表
const provinceList = ref<string[]>([
  '北京市', '天津市', '上海市', '重庆市',
  '河北省', '山西省', '辽宁省', '吉林省', '黑龙江省',
  '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省',
  '河南省', '湖北省', '湖南省', '广东省', '海南省',
  '四川省', '贵州省', '云南省', '陕西省', '甘肃省',
  '青海省', '台湾省',
  '内蒙古自治区', '广西壮族自治区', '西藏自治区', 
  '宁夏回族自治区', '新疆维吾尔自治区',
  '香港特别行政区', '澳门特别行政区'
])

const cityList = ref<string[]>([])

// 上传配置
const uploadUrl = '/api/admin/upload/image'
const uploadHeaders = computed(() => ({
  Authorization: `Bearer ${localStorage.getItem('admin_token')}`
}))

onMounted(async () => {
  if (isEdit.value) {
    await loadDetail()
  }
  initMap()
})

onUnmounted(() => {
  if (map) {
    map = null
    marker = null
  }
})

async function loadDetail() {
  try {
    const res = await getSalesPointDetail(Number(route.query.id))
    if (res && res.code === 200 && res.data) {
      Object.assign(form, res.data)
      // 更新城市列表
      if (form.province) {
        updateCityList(form.province)
      }
      // 解析图片列表
      if (form.images) {
        try {
          const urls = JSON.parse(form.images)
          imageList.value = urls.map((url: string, index: number) => ({
            name: `image-${index}`,
            url
          }))
        } catch (e) {
          console.error('解析图片列表失败:', e)
        }
      }
    }
  } catch (error) {
    console.error('加载详情失败:', error)
    ElMessage.error('加载详情失败')
  }
}

function initMap() {
  // 尝试加载百度地图
  if (typeof window !== 'undefined' && (window as any).BMap) {
    createMap()
  } else {
    // 动态加载百度地图SDK
    const script = document.createElement('script')
    script.src = 'https://api.map.baidu.com/api?v=3.0&ak=WMGYusN4ZWBlLrDxfzA2bjRGI2vzXS1g&callback=initBaiduMap'
    
    // 定义回调函数
    ;(window as any).initBaiduMap = () => {
      setTimeout(createMap, 100)
    }
    
    script.onerror = () => {
      console.warn('地图加载失败，请手动输入坐标')
      mapLoaded.value = false
    }
    document.head.appendChild(script)
  }
}

function createMap() {
  try {
    const BMap = (window as any).BMap
    if (!BMap) {
      console.warn('百度地图SDK未加载')
      return
    }

    const mapContainer = document.getElementById('map')
    if (!mapContainer) {
      console.warn('地图容器未找到')
      return
    }

    map = new BMap.Map(mapContainer)
    const center = new BMap.Point(form.longitude, form.latitude)
    map.centerAndZoom(center, 15)
    map.enableScrollWheelZoom(true)

    // 添加标记
    marker = new BMap.Marker(center)
    map.addOverlay(marker)

    // 点击地图选点
    map.addEventListener('click', (e: any) => {
      const lat = e.point.lat
      const lng = e.point.lng
      form.latitude = lat
      form.longitude = lng
      updateMarker(lat, lng)
    })

    mapLoaded.value = true
    
    // 新增网点时自动定位到当前位置
    if (!isEdit.value) {
      getCurrentLocation()
    }
  } catch (error) {
    console.error('创建地图失败:', error)
    mapLoaded.value = false
  }
}

// 获取当前位置
function getCurrentLocation() {
  const BMap = (window as any).BMap
  if (!BMap) return
  
  const geolocation = new BMap.Geolocation()
  geolocation.getCurrentPosition(function(r: any) {
    if (geolocation.getStatus() === 0) {
      form.latitude = r.point.lat
      form.longitude = r.point.lng
      map.setCenter(r.point)
      updateMarker(r.point.lat, r.point.lng)
    }
  }, { enableHighAccuracy: true })
}

function updateMarker(lat: number, lng: number) {
  if (marker && map) {
    const BMap = (window as any).BMap
    const point = new BMap.Point(lng, lat)
    marker.setPosition(point)
  }
}

function locateOnMap() {
  if (map && form.latitude && form.longitude) {
    const BMap = (window as any).BMap
    const center = new BMap.Point(form.longitude, form.latitude)
    map.setCenter(center)
    updateMarker(form.latitude, form.longitude)
  }
}

function handleProvinceChange() {
  form.city = ''
  updateCityList(form.province)
}

function handleCityChange() {
  // 城市变化时可以触发地址解析
}

function updateCityList(province: string) {
  const cityMap: Record<string, string[]> = {
    '湖南省': ['长沙市', '株洲市', '湘潭市', '衡阳市', '邵阳市', '岳阳市', '常德市', '张家界市', '益阳市', '郴州市', '永州市', '怀化市', '娄底市', '湘西土家族苗族自治州'],
    '广东省': ['广州市', '深圳市', '珠海市', '汕头市', '佛山市', '韶关市', '湛江市', '肇庆市', '江门市', '茂名市', '惠州市', '梅州市', '汕尾市', '河源市', '阳江市', '清远市', '东莞市', '中山市', '潮州市', '揭阳市', '云浮市'],
    '北京市': ['北京市'],
    '上海市': ['上海市'],
    '浙江省': ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市', '丽水市'],
    '江苏省': ['南京市', '无锡市', '徐州市', '常州市', '苏州市', '南通市', '连云港市', '淮安市', '盐城市', '扬州市', '镇江市', '泰州市', '宿迁市'],
    '四川省': ['成都市', '自贡市', '攀枝花市', '泸州市', '德阳市', '绵阳市', '广元市', '遂宁市', '内江市', '乐山市', '南充市', '眉山市', '宜宾市', '广安市', '达州市', '雅安市', '巴中市', '资阳市'],
    '河北省': ['石家庄市', '唐山市', '秦皇岛市', '邯郸市', '邢台市', '保定市', '张家口市', '承德市', '沧州市', '廊坊市', '衡水市'],
    '山东省': ['济南市', '青岛市', '淄博市', '枣庄市', '东营市', '烟台市', '潍坊市', '济宁市', '泰安市', '威海市', '日照市', '临沂市', '德州市', '聊城市', '滨州市', '菏泽市'],
    '山西省': ['太原市', '大同市', '阳泉市', '长治市', '晋城市', '朔州市', '晋中市', '运城市', '忻州市', '临汾市', '吕梁市']
  }
  
  cityList.value = cityMap[province] || []
}

async function handleGeocode() {
  // 智能拼接地址，避免重复
  let fullAddress = form.address || ''
  // 如果详细地址不包含省市信息，则添加省市区前缀
  if (fullAddress && !fullAddress.includes(form.province) && form.province) {
    fullAddress = `${form.province}${form.city || ''}${form.district || ''}${fullAddress}`
  }
  if (!fullAddress.trim()) {
    ElMessage.warning('请先输入地址信息')
    return
  }

  geocoding.value = true
  try {
    const res = await geocodeAddress(fullAddress)
    console.log('地址解析响应:', res)
    // 响应拦截器已返回response.data，直接使用res
    if (res && res.code === 200 && res.data) {
      form.latitude = res.data.latitude
      form.longitude = res.data.longitude
      ElMessage.success('坐标获取成功')
      // 更新地图标记
      if (mapLoaded.value) {
        locateOnMap()
      }
    } else {
      ElMessage.warning(res?.message || '获取坐标失败，请手动输入')
    }
  } catch (error) {
    console.error('地址解析失败:', error)
    ElMessage.warning('获取坐标失败，请手动输入经纬度')
  } finally {
    geocoding.value = false
  }
}

// 地址输入框失焦时自动获取坐标
function handleAddressBlur() {
  // 如果地址有内容且省市已选择，自动获取坐标
  if (form.address && form.province && form.city && !geocoding.value) {
    handleGeocode()
  }
}

function handleUploadSuccess(response: any, file: UploadFile) {
  if (response.code === 200) {
    file.url = response.data.url
    updateImagesField()
  } else {
    ElMessage.error('上传失败')
  }
}

function handleRemove() {
  updateImagesField()
}

function updateImagesField() {
  const urls = imageList.value
    .filter(file => file.url)
    .map(file => file.url)
  form.images = JSON.stringify(urls)
}

function beforeUpload(file: File) {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过5MB')
    return false
  }
  return true
}

async function handleSubmit() {
  try {
    await formRef.value.validate()
    
    saving.value = true
    
    // 更新图片字段
    updateImagesField()
    
    let res
    if (isEdit.value) {
      res = await updateSalesPoint(Number(route.query.id), form)
    } else {
      res = await createSalesPoint(form)
    }

    // 响应拦截器已返回response.data，直接使用res.code
    if (res && (res.code === 200 || res.message?.includes('成功'))) {
      ElMessage.success(isEdit.value ? '保存成功' : '创建成功')
      router.push('/enterprise/sales-point')
    } else {
      ElMessage.error(res?.message || '操作失败')
    }
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    saving.value = false
  }
}

function handleBack() {
  router.push('/enterprise/sales-point')
}
</script>

<style scoped>
.sales-point-edit {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.edit-form {
  max-width: 900px;
}

.map-container {
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.map-placeholder {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  color: #909399;
}

.map-placeholder p {
  margin: 10px 0 0;
}

.map-tip {
  font-size: 12px;
  color: #c0c4cc;
}

.map {
  height: 300px;
  width: 100%;
}

.map-actions {
  padding: 10px;
  background: #f5f7fa;
  border-top: 1px solid #dcdfe6;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 100px;
  height: 100px;
}

:deep(.el-upload--picture-card) {
  width: 100px;
  height: 100px;
}
</style>
