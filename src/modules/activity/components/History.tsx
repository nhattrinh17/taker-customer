/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native'
import CommonText from 'components/CommonText'
import {Colors} from 'assets/Colors'
import {Icons} from 'assets/icons'
import {Fonts} from 'assets/Fonts'
import dayjs from 'dayjs'
import {navigate} from 'navigation/utils/navigationUtils'
import {ItemHistory} from 'services/src/typings'
import {
  useGetDetailOrder,
  useGetListHistoryActivity,
} from 'services/src/serveRequest/serveService'
import {appStore} from 'state/app'
import {renderStatusActivity} from 'utils/index'
import {formatCurrency} from 'modules/requestServe/utils'
import {StatusActivity} from '../typings'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  flatList: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  item: {
    flexDirection: 'row',
    paddingVertical: 30,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  rightItem: {
    flex: 1,
    marginLeft: 16,
  },
  rowTime: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  time: {
    fontWeight: '700',
    fontSize: Fonts.fontSize[12],
  },
  success: {
    color: Colors.main,
  },
  rowStar: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginLeft: 10,
  },
  star: {
    marginHorizontal: 2,
  },
  row: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueInCome: {
    fontWeight: '600',
  },
  mt6: {
    marginTop: 6,
  },
  rate: {
    color: Colors.white,
  },
  btRate: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.main,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  wrapperEmpty: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  emptyLabel: {
    textAlign: 'center',
    marginTop: 16,
  },
})

const TAKE = 20

const History = () => {
  const {triggerListHistory} = useGetListHistoryActivity()
  const {setLoading, loading} = appStore(state => state)
  const {triggerGetDetailOrder} = useGetDetailOrder()
  const [isReload, setIsReload] = useState(false)

  const [history, setHistory] = useState<{
    data: ItemHistory[]
    enabledLoadMore: boolean
  }>({data: [], enabledLoadMore: true})

  const getHistory = async (params: {
    take: number
    skip: number
    isFirstTime: boolean
  }) => {
    if (!history?.enabledLoadMore || loading) {
      return
    }
    setLoading(true)
    try {
      const response = await triggerListHistory({
        take: params.take,
        skip: params.skip,
      })
      if (response?.data?.length) {
        setHistory({
          data: params?.isFirstTime
            ? response?.data
            : [...history.data, ...response?.data],
          enabledLoadMore: response?.data?.length < TAKE ? false : true,
        })
      } else {
        setHistory({...history, enabledLoadMore: false})
      }
    } catch (err) {
    } finally {
      setIsReload(false)
      setLoading(false)
    }
  }

  const onLoadMore = () =>
    getHistory({take: TAKE, skip: history.data.length, isFirstTime: false})

  useEffect(() => {
    getHistory({take: TAKE, skip: 0, isFirstTime: true})
  }, [])

  const onPressDetailOrder = (item: ItemHistory) => async () => {
    setLoading(true)
    try {
      const response = await triggerGetDetailOrder({id: item?.id})
      if (response?.data) {
        navigate('DetailOrder', {
          itemDetail: response?.data,
          status: item?.status,
        })
      }
    } catch (err) {
      //
    } finally {
      setLoading(false)
    }
  }

  const onPressRate = (item: ItemHistory, indexItem: number) => () => {
    const onRateSuccess = (rate: number) => {
      const newItem = {...item, rating: {rating: rate}}
      const newData = [...history.data]
      newData[indexItem] = newItem
      setHistory({...history, data: newData})
    }
    navigate('RequestServeStack', {
      screen: 'RateOrder',
      params: {
        prevScreen: 'History',
        tripId: item?.id,
        shoemakerId: item?.shoemaker?.id,
        onRateSuccess: onRateSuccess,
        infoShoeMaker: item?.shoemaker,
      },
    })
  }

  const renderKeyExtractor = (item: ItemHistory) => `${item?.id}`

  const renderRate = ({
    star,
    item,
    indexItem,
  }: {
    star: number
    item: ItemHistory
    indexItem: number
  }) => {
    if (star) {
      return (
        <View style={styles.row}>
          <CommonText text="Đánh giá của bạn:" />
          <View style={styles.rowStar}>
            {[1, 2, 3, 4, 5].map((itemStart, index) => {
              return (
                <View key={index} style={styles.star}>
                  {item?.rating !== null &&
                  item?.rating?.rating >= itemStart ? (
                    <Icons.StartFullSmall />
                  ) : (
                    <Icons.StartSmall />
                  )}
                </View>
              )
            })}
          </View>
        </View>
      )
    }
    return (
      <TouchableOpacity
        style={styles.btRate}
        onPress={onPressRate(item, indexItem)}>
        <CommonText text="Đánh giá" styles={styles.rate} />
      </TouchableOpacity>
    )
  }

  const renderEmpty = () => {
    return (
      <View style={styles.wrapperEmpty}>
        <Icons.NoticeEmpty />
        <CommonText text="Chưa có lịch sử" styles={styles.emptyLabel} />
      </View>
    )
  }

  const renderItem = ({item, index}: {item: ItemHistory; index: number}) => {
    return (
      <TouchableOpacity
        onPress={onPressDetailOrder(item)}
        style={{
          ...styles.item,
          borderBottomWidth: index !== history?.data?.length - 1 ? 1 : 0,
        }}>
        <Icons.Product />
        <View style={styles.rightItem}>
          <View style={styles.rowTime}>
            <CommonText
              text={dayjs(item?.createdAt).format('HH:mm, DD/MM/YYYY')}
              styles={styles.time}
            />
            <CommonText
              text={renderStatusActivity(item?.status)}
              styles={styles.success}
            />
          </View>

          <CommonText
            text={`Tổng tiền: ${formatCurrency(item?.totalPrice)} đ`}
          />
          <CommonText text={item?.address ?? ''} styles={styles.mt6} />

          {item?.status === StatusActivity.COMPLETED &&
            renderRate({
              star: item?.rating?.rating ?? 0,
              item,
              indexItem: index,
            })}
        </View>
      </TouchableOpacity>
    )
  }

  if (!history?.data?.length) {
    return renderEmpty()
  }
  return (
    <View style={styles.container}>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={isReload}
            onRefresh={() => {
              setIsReload(true)
              getHistory({take: TAKE, skip: 0, isFirstTime: true})
            }}
          />
        }
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
        data={history.data}
        keyExtractor={renderKeyExtractor}
        renderItem={renderItem}
        onStartReachedThreshold={0.1}
        onEndReached={onLoadMore}
      />
    </View>
  )
}

export default History
