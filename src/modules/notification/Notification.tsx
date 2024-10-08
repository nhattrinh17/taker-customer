import React, {useEffect, useState} from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  FlatList,
} from 'react-native'
import CommonText from 'components/CommonText'
import {Colors} from 'assets/Colors'
import {Fonts} from 'assets/Fonts'
import {Icons} from 'assets/icons'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {appStore} from 'state/app'
import {
  useGetNotification,
  useReadNotification,
} from 'services/src/notification/notificationService'
import {ItemDataNotification, ItemNotification} from 'services/src/typings'
import dayjs from 'dayjs'
import {NOTIFICATIONS_SCREEN} from 'utils/index'
import {navigate} from 'navigation/utils/navigationUtils'
import {useIsFocused} from '@react-navigation/native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentContainer: {
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
  },
  wrapper: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 64 : 4,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  header: {
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
  rightHeader: {
    backgroundColor: Colors.main,
    borderRadius: 20,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    color: Colors.white,
    fontSize: Fonts.fontSize[12],
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
  },
  item: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  itemRight: {
    flex: 1,
    paddingLeft: 10,
  },
  itemTitle: {
    fontSize: Fonts.fontSize[14],
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  itemTitleUnRead: {
    fontSize: Fonts.fontSize[14],
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  itemContent: {
    fontSize: Fonts.fontSize[14],
    color: Colors.textPrimary,
    flexShrink: 1,
  },
  itemContentUnRead: {
    fontSize: Fonts.fontSize[14],
    color: Colors.textSecondary,
    flexShrink: 1,
  },
  itemDate: {
    fontSize: Fonts.fontSize[12],
    color: Colors.textSecondary,
  },
  contentEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 200,
  },
  emptyLabel: {
    fontSize: Fonts.fontSize[14],
    fontWeight: '500',
    color: Colors.textPrimary,
    marginTop: 10,
  },
  flatList: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  rowTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})

const TAKE = 20

const Notification = () => {
  const {top} = useSafeAreaInsets()
  const isFocused = useIsFocused()
  const {triggerReadNotification} = useReadNotification()
  const {setLoading, loading} = appStore(state => state)
  const {triggerGetNotification} = useGetNotification()
  const [notifications, setNotifications] = useState<{
    data: ItemNotification[]
    enabledLoadMore: boolean
  }>({data: [], enabledLoadMore: true})

  const getHistory = async (params: {
    take: number
    skip: number
    isFirstTime: boolean
  }) => {
    if (!notifications?.enabledLoadMore || loading) {
      return
    }
    setLoading(true)
    try {
      const response = await triggerGetNotification({
        take: params.take,
        skip: params.skip,
      })
      if (response?.data?.notifications?.length) {
        setNotifications({
          data: params?.isFirstTime
            ? response?.data?.notifications
            : [...notifications.data, ...response?.data?.notifications],
          enabledLoadMore:
            response?.data?.notifications?.length < TAKE ? false : true,
        })
      } else {
        setNotifications({...notifications, enabledLoadMore: false})
      }
    } catch (err) {
    } finally {
      setLoading(false)
    }
  }

  const onLoadMore = () => {
    getHistory({
      take: TAKE,
      skip: notifications.data.length,
      isFirstTime: false,
    })
  }

  useEffect(() => {
    if (isFocused && notifications.data.length === 0) {
      console.log('Run here =====>', notifications.data.length)
      getHistory({take: TAKE, skip: 0, isFirstTime: true})
    }
  }, [isFocused])

  const renderEmptyList = () => (
    <View style={styles.contentEmpty}>
      <Icons.NoticeEmpty />
      <CommonText text="Chưa có thông báo" styles={styles.emptyLabel} />
    </View>
  )

  const renderKeyExtractor = (item: ItemNotification) => item?.id

  const readNotification = async (item: ItemNotification) => {
    try {
      const response = await triggerReadNotification({id: item.id})
      console.log('response', response)
      if (response?.data) {
        const newNoti = notifications.data.map(noti => {
          if (noti.id === item.id) {
            return {
              ...noti,
              isRead: true,
            }
          }
          return noti
        })
        setNotifications({...notifications, data: newNoti})
      }
    } catch (err) {
      //
    } finally {
    }
  }

  const onPressItem = (item: ItemNotification) => () => {
    readNotification(item)
    if (item?.data) {
      const data = JSON.parse(item?.data) as ItemDataNotification
      if (data?.screen) {
        switch (data?.screen) {
          case NOTIFICATIONS_SCREEN.CUSTOMER_CARE:
            break
          case NOTIFICATIONS_SCREEN.DETAIL_NOTIFICATION:
            break
          case NOTIFICATIONS_SCREEN.HOME:
            // navigate('Home')
            break
          case NOTIFICATIONS_SCREEN.REQUEST_TRIP:
            navigate('RequestServeStack')
            break
          case NOTIFICATIONS_SCREEN.WALLET:
            navigate('Wallet')
            break
          default:
            break
        }
      }
    }
  }

  const renderItem = ({item}: {item: ItemNotification}) => {
    return (
      <TouchableOpacity style={styles.item} onPress={onPressItem(item)}>
        {item.isRead ? <Icons.NoticeRead /> : <Icons.NoticeUnRead />}
        <View style={styles.itemRight}>
          <View style={styles.rowTitle}>
            <CommonText
              text={item.title}
              styles={item.isRead ? styles.itemTitle : styles.itemTitleUnRead}
            />
            <CommonText
              text={dayjs(item.createdAt).format('HH:mm, DD/MM/YYYY')}
              styles={styles.itemDate}
            />
          </View>

          <CommonText
            text={item.content}
            styles={item.isRead ? styles.itemContent : styles.itemContentUnRead}
          />
        </View>
      </TouchableOpacity>
    )
  }

  const countNotificationUnRead = notifications?.data.filter(
    e => !e?.isRead,
  )?.length

  return (
    <>
      <View style={{...styles.header, paddingTop: top}}>
        <CommonText text="Thông báo" styles={styles.titleHeader} />
        <View style={styles.rightHeader}>
          <CommonText
            text={countNotificationUnRead?.toString() ?? 0}
            styles={styles.count}
          />
        </View>
      </View>
      <FlatList
        data={notifications.data}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
        onEndReached={onLoadMore}
        contentContainerStyle={styles.contentContainer}
        onEndReachedThreshold={0.1}
        keyExtractor={renderKeyExtractor}
        ListEmptyComponent={renderEmptyList}
      />
    </>
  )
}

export default Notification
