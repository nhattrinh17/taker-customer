import React, {useEffect, useState} from 'react'
import {View, StyleSheet, TouchableOpacity, FlatList} from 'react-native'
import CommonText from 'components/CommonText'
import {Colors} from 'assets/Colors'
import Header from 'components/Header'
import {Fonts} from 'assets/Fonts'
import {navigate} from 'navigation/utils/navigationUtils'
import {useGetListHistoryWalletTransaction} from 'services/src/serveRequest/serveService'
import {appStore} from 'state/app'
import {ItemHistoryTransaction} from 'services/src/typings'
import {formatCurrency} from 'utils/index'
import {useIsFocused} from '@react-navigation/native'
import {useGetBalance} from 'services/src/profile'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
  },
  walletBox: {
    backgroundColor: Colors.main,
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderRadius: 12,
  },
  labelWalletBox: {
    color: Colors.white,
  },
  amount: {
    flexDirection: 'row',
  },
  unit: {
    color: Colors.white,
    marginTop: 9,
    marginLeft: 2,
  },
  labelAmount: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  groupButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
    marginTop: 20,
  },
  labelRecharge: {
    color: Colors.white,
    fontWeight: '500',
    marginTop: 10,
  },
  labelHistory: {
    marginTop: 24,
    paddingBottom: 10,
    fontSize: Fonts.fontSize[18],
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 10,
    flexDirection: 'row',
  },
  rightItem: {
    flex: 1,
    alignItems: 'flex-end',
  },
  titleItem: {
    fontSize: Fonts.fontSize[14],
  },
  dateItem: {
    color: Colors.textSecondary,
    fontSize: Fonts.fontSize[12],
  },
  plusAmountItem: {
    color: Colors.main,
  },
  minusAmountItem: {
    color: Colors.red,
  },
  flatList: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  flatListContent: {
    // paddingTop: 20,
    flexGrow: 1,
    paddingBottom: 30,
  },
  textSuccess: {
    color: Colors.main,
  },
  textFail: {
    color: Colors.red,
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
    paddingTop: 12,
  },
  minBalance: {
    marginTop: 14,
    color: Colors.white,
    fontSize: Fonts.fontSize[12],
  },
})

const TAKE = 20

const Wallet = () => {
  const {triggerGetBalance, balance} = useGetBalance()
  const isFocused = useIsFocused()
  const {setLoading, loading} = appStore(state => state)
  const {triggerGetWalletHistory} = useGetListHistoryWalletTransaction()
  const [history, setHistory] = useState<{
    data: ItemHistoryTransaction[]
    enabledLoadMore: boolean
  }>({data: [], enabledLoadMore: true})

  const onPressWithdraw = () => navigate('Withdraw')
  const onPressDeposit = () => navigate('Deposit')

  const getHistory = async (params: {
    take: number
    skip: number
    isFirstTime: boolean
  }) => {
    if ((!history?.enabledLoadMore || loading) && !params?.isFirstTime) {
      return
    }
    setLoading(true)
    try {
      const response = await triggerGetWalletHistory({
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
      }
    } catch (err) {
    } finally {
      setLoading(false)
    }
  }

  const onLoadMore = () =>
    getHistory({take: TAKE, skip: history.data.length, isFirstTime: false})

  useEffect(() => {
    if (isFocused) {
      triggerGetBalance()
      getHistory({take: TAKE, skip: 0, isFirstTime: true})
    }
  }, [isFocused, triggerGetBalance])

  const renderStatus = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <CommonText text="Đang xử lý" />
      case 'SUCCESS':
        return <CommonText text="Thành công" styles={styles.textSuccess} />
      case 'FAILED':
        return <CommonText text="Thất bại" styles={styles.textFail} />
      default:
        return <CommonText text="" styles={styles.minusAmountItem} />
    }
  }

  const renderKeyExtractor = (item: ItemHistoryTransaction, index: number) =>
    `${item?.transactionType} - ${item?.amount} - ${index}`

  const renderItem = ({item}: {item: ItemHistoryTransaction}) => (
    <View style={styles.rowItem}>
      <View>
        <CommonText text={item?.description} styles={styles.titleItem} />
        <CommonText text={item?.transactionDate} styles={styles.dateItem} />
      </View>
      <View style={styles.rightItem}>
        {item.transactionType === 'DEPOSIT' ? (
          <CommonText
            text={`+ ${formatCurrency(item?.amount)}đ`}
            styles={styles.plusAmountItem}
          />
        ) : (
          <CommonText
            text={`- ${formatCurrency(item.amount)}đ`}
            styles={styles.minusAmountItem}
          />
        )}
        {renderStatus(item?.status)}
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <Header title="Ví Taker" />
      <View style={styles.wrapper}>
        <View style={styles.walletBox}>
          <CommonText text="Số dư (đ)" styles={styles.labelWalletBox} />
          <CommonText
            text={formatCurrency(balance) + 'đ'}
            styles={styles.labelAmount}
          />
          <View style={styles.groupButtons}>
            <TouchableOpacity onPress={onPressDeposit}>
              <CommonText text="Nạp tiền" styles={styles.labelRecharge} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressWithdraw}>
              <CommonText
                text="Yêu cầu rút tiền"
                styles={styles.labelRecharge}
              />
            </TouchableOpacity>
          </View>
        </View>
        {history?.data?.length !== 0 && (
          <CommonText text="Lịch sử giao dịch" styles={styles.labelHistory} />
        )}
        <FlatList
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
          style={styles.flatList}
          data={history?.data}
          keyExtractor={renderKeyExtractor}
          renderItem={renderItem}
          onStartReachedThreshold={0.1}
          onEndReached={onLoadMore}
        />
      </View>
    </View>
  )
}

export default Wallet
