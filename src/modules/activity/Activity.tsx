import React, {useEffect, useState} from 'react'
import {View, StyleSheet, Platform, TouchableOpacity} from 'react-native'
import CommonText from 'components/CommonText'
import {Colors} from 'assets/Colors'
import {Fonts} from 'assets/Fonts'
import Processing from './components/Processing'
import History from './components/History'
import {useGetServiceInProgress} from 'services/src/serveRequest/serveService'
import {appStore} from 'state/app'
import {ItemInProgress} from 'services/src/typings'
import {EventBus, EventBusType} from 'observer'
import {serveRequestStore} from 'state/serveRequest/serveRequestStore'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  text: {
    fontSize: Fonts.fontSize[18],
    fontFamily: Fonts.fontFamily.AvertaBold,
    color: Colors.black,
    lineHeight: 24,
    fontWeight: '700',
  },
  wrapperHeader: {
    shadowColor: '#22313F',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    zIndex: 999,
    ...Platform.select({
      android: {
        paddingTop: 40,
      },
    }),
  },
  titleHeader: {
    fontWeight: '700',
    fontSize: Fonts.fontSize[16],
  },
  rowRightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subTitleHeader: {
    fontSize: Fonts.fontSize[12],
    fontWeight: '600',
  },
  activeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.main,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  ml10: {
    marginLeft: 10,
  },
  activeText: {
    color: Colors.white,
  },
  wrapperContent: {
    zIndex: 1,
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    marginTop: 6,
    paddingTop: 12,
  },
  z100: {
    zIndex: 100,
  },
  safeArea: {
    backgroundColor: Colors.white,
    zIndex: 1999,
  },
})

enum Tab {
  PROCESSING = 'PROCESSING',
  HISTORY = 'HISTORY',
}

const Activity = () => {
  const setLoading = appStore(state => state.setLoading)
  const {top} = useSafeAreaInsets()
  const {updateOrderInProgress} = serveRequestStore(state => state)
  const {triggerServiceInProgress} = useGetServiceInProgress()
  const [activeTab, setActiveTab] = useState<Tab>(Tab.PROCESSING)
  const [inProgress, setInProgress] = useState<ItemInProgress[]>([])

  const onPressItemHeader = (type: Tab) => () => {
    setActiveTab(type)
  }

  const onCancelSuccess = () => {
    setActiveTab(Tab.HISTORY)
  }

  const getServiceInProgress = async () => {
    try {
      setLoading(true)
      const response = await triggerServiceInProgress()
      if (response?.data?.length) {
        updateOrderInProgress(response?.data)
        setInProgress(response.data)
      }
    } catch (err) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    EventBus.on(EventBusType.CREATE_ORDER_SUCCESS, () => {
      getServiceInProgress()
    })

    EventBus.on(EventBusType.FIND_CLOSET_SHOE_MAKERS, () => {
      getServiceInProgress()
    })
    EventBus.on(EventBusType.UPDATE_STATUS_ORDER, () => {
      getServiceInProgress()
    })

    EventBus.on(EventBusType.CANCEL_ORDER_SUCCESS, () => {
      setInProgress([])
      updateOrderInProgress([])
    })

    EventBus.on(EventBusType.FINISHED_ORDER, () => {
      setInProgress([])
      updateOrderInProgress([])
    })
  }, [])

  useEffect(() => {
    getServiceInProgress()
  }, [])

  const renderHeader = () => (
    <View style={{...styles.z100}}>
      <View style={{...styles.wrapperHeader, paddingTop: top}}>
        <CommonText text="Đơn hàng" styles={styles.titleHeader} />
        <View style={styles.rowRightHeader}>
          <TouchableOpacity
            style={{...(activeTab === Tab.PROCESSING && styles.activeButton)}}
            onPress={onPressItemHeader(Tab.PROCESSING)}>
            <CommonText
              text="Đang thực hiện"
              styles={{
                ...styles.subTitleHeader,
                ...(activeTab === Tab.PROCESSING && styles.activeText),
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              ...styles.ml10,
              ...(activeTab !== Tab.PROCESSING && styles.activeButton),
            }}
            onPress={onPressItemHeader(Tab.HISTORY)}>
            <CommonText
              text="Lịch sử"
              styles={{
                ...styles.subTitleHeader,
                ...(activeTab !== Tab.PROCESSING && styles.activeText),
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  return (
    <View style={{...styles.container}}>
      {renderHeader()}
      <View style={styles.wrapperContent}>
        {activeTab === Tab.PROCESSING ? (
          <Processing
            inProgress={inProgress}
            onCancelSuccess={onCancelSuccess}
          />
        ) : (
          <History />
        )}
      </View>
    </View>
  )
}

export default Activity
