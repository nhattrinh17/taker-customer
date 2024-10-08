/* eslint-disable react-native/no-inline-styles */
import {Icons} from 'assets/icons';
import CommonButton from 'components/Button';
import CommonText from 'components/CommonText';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import ItemMaker from './ItemMaker';
import {Fonts} from 'assets/Fonts';
import {Colors} from 'assets/Colors';
import {formatCurrency} from 'modules/requestServe/utils';
import ButtonCancel from './ButtonCancel';
import {StatusActivity} from 'modules/activity/typings';
import {payments} from 'utils/index';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    position: 'relative',
  },
  mapView: {
    flex: 1,
  },
  bottomView: {
    paddingTop: 20,
    paddingBottom: 48,
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
  },
  viewAddress: {
    borderRadius: 4,
    backgroundColor: Colors.gallery,
    padding: 8,
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 50,
  },
  wrapperAddress: {
    marginLeft: 12,
  },
  nameLocation: {
    fontWeight: '700',
    fontFamily: Fonts.fontFamily.AvertaBold,
  },
  addressLocation: {
    color: Colors.textSecondary,
  },
  rowNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  textNote: {
    fontSize: Fonts.fontSize[12],
    color: Colors.cerulean,
    marginLeft: 8,
  },
  btChoose: {
    marginTop: 20,
  },
  wrapperErrorView: {
    marginTop: 16,
    backgroundColor: Colors.lavenderBlush,
    paddingVertical: 12,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
  },
  rowTextErr: {
    flex: 1,
    marginLeft: 12,
  },
  titleErr: {
    fontWeight: '700',
    fontFamily: Fonts.fontFamily.AvertaBold,
    color: Colors.red,
  },
  descErr: {
    fontSize: Fonts.fontSize[12],
  },
  buttonBack: {
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    marginLeft: 20,
    marginTop: 60,
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  ml12: {
    marginLeft: 12,
  },
  inputNote: {
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.main,
    marginTop: 18,
    borderRadius: 6,
    fontSize: Fonts.fontSize[14],
    fontFamily: Fonts.fontFamily.AvertaRegular,
  },
  wrapperFinding: {
    backgroundColor: Colors.white,
    paddingTop: 12,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  rowTopFinding: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowFinding: {
    paddingLeft: 16,
    flex: 1,
  },
  textStatus: {
    color: Colors.textSecondary,
    fontSize: Fonts.fontSize[12],
  },
  finding: {
    color: Colors.main,
    fontWeight: '600',
    fontFamily: Fonts.fontFamily.AvertaBold,
  },
  line: {
    width: '100%',
    height: 0.5,
    backgroundColor: Colors.gallery,
    marginVertical: 12,
  },
  rowTypeCash: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 42,
  },
  cash: {
    fontSize: Fonts.fontSize[12],
    color: Colors.textSecondary,
  },
  btCancel: {
    marginBottom: 20,
  },
  btRetry: {
    borderRadius: 6,
    marginBottom: 20,
  },
  rowTopWaiting: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeWaiting: {
    color: Colors.main,
    fontWeight: '700',
    fontFamily: Fonts.fontFamily.AvertaBold,
  },
  textWaiting: {
    marginLeft: 8,
  },
  btRate: {
    borderRadius: 6,
  },
  mb16: {
    marginBottom: 16,
  },
  total: {
    fontWeight: '700',
    fontFamily: Fonts.fontFamily.AvertaSemiBold,
  },
});
interface Props {
  status: StatusActivity;
  onPressRetry: () => void;
  onCancel: () => void;
  onPressRate: () => void;
  total: number;
  informationShoeMaker: serve.InformationShoeMaker | null;
  paymentMethod: number;
}

const renderTypePayment = (key: number | string) => {
  return (
    'Thanh toán bằng ' +
      payments.find(item => {
        if (typeof key === 'number') {
          return item.id === key;
        } else if (typeof key === 'string') {
          return item.key === key;
        }
      })?.name ?? ''
  );
};
const StatusOrder = ({
  status,
  onPressRetry,
  total,
  onCancel,
  onPressRate,
  informationShoeMaker,
  paymentMethod,
}: Props) => {
  const renderViewCancel = (type: 'waiting' | 'finding') => (
    <>
      <View
        style={[
          styles.rowTypeCash,
          {marginBottom: type === 'waiting' ? 16 : 42},
        ]}>
        <CommonText
          text={renderTypePayment(paymentMethod)}
          styles={styles.cash}
        />
        <CommonText text={`${formatCurrency(total)}đ`} styles={styles.total} />
      </View>

      <ButtonCancel
        title="Hủy đặt"
        onPress={onCancel}
        style={styles.btCancel}
      />
    </>
  );

  const renderStatusFinding = () => {
    return (
      <View style={styles.wrapperFinding}>
        <View style={styles.rowTopFinding}>
          <Icons.People />
          <View style={styles.rowFinding}>
            <CommonText
              text="Đang tìm thợ đánh giày ..."
              styles={styles.finding}
            />
            <CommonText
              text="Nhu cầu đặt thợ đang cao, bạn chờ xíu nhé."
              styles={styles.textStatus}
            />
          </View>
        </View>
        <View style={styles.line} />
        {renderViewCancel('finding')}
      </View>
    );
  };

  const renderStatusNotFinding = () => {
    return (
      <View style={styles.wrapperFinding}>
        <View style={styles.rowTopFinding}>
          <Icons.People />
          <View style={styles.rowFinding}>
            <CommonText
              text="Không tìm thấy thợ đánh giày"
              styles={{...styles.finding, color: Colors.red}}
            />
            <CommonText
              text="Nhu cầu đặt thợ đang cao, bạn vui lòng thử lại."
              styles={styles.textStatus}
            />
          </View>
        </View>
        <View style={styles.line} />

        <View style={styles.rowTypeCash}>
          <CommonText
            text={renderTypePayment(paymentMethod)}
            styles={styles.cash}
          />
          <CommonText
            text={`${formatCurrency(total)}đ`}
            styles={styles.total}
          />
        </View>

        <CommonButton
          text="Đặt lại"
          onPress={onPressRetry}
          buttonStyles={styles.btRetry}
        />
      </View>
    );
  };

  const renderStatusWaiting = () => {
    return (
      <View style={styles.wrapperFinding}>
        <View style={styles.rowTopWaiting}>
          <Icons.Walk />
          <CommonText
            text={`${(informationShoeMaker?.distance || 0).toFixed(2)} km`}
            styles={styles.textWaiting}
          />
          <CommonText
            text="Thời gian chờ dự kiến:"
            styles={styles.textWaiting}
          />
          <CommonText
            text={` ${Math.round(informationShoeMaker?.time ?? 1)} phút`}
            styles={styles.timeWaiting}
          />
        </View>
        <View style={styles.line} />

        <ItemMaker
          avatar={informationShoeMaker?.avatar ?? ''}
          name={informationShoeMaker?.fullName ?? ''}
          phoneNumber={informationShoeMaker?.phone ?? ''}
        />
        <View style={styles.line} />

        {renderViewCancel('waiting')}
      </View>
    );
  };

  const renderStatusProcessing = () => {
    return (
      <View style={styles.wrapperFinding}>
        <View style={styles.rowTopWaiting}>
          <Icons.Checking />
          <CommonText
            text="Đang thực hiện dịch vụ"
            styles={styles.textWaiting}
          />
        </View>
        <View style={styles.line} />

        <ItemMaker
          avatar={informationShoeMaker?.avatar ?? ''}
          name={informationShoeMaker?.fullName ?? ''}
          phoneNumber={informationShoeMaker?.phone ?? ''}
        />
        <View style={styles.line} />

        <View style={styles.rowTypeCash}>
          <CommonText
            text={renderTypePayment(paymentMethod)}
            styles={styles.cash}
          />
          <CommonText
            text={`${formatCurrency(total)}đ`}
            styles={styles.total}
          />
        </View>
      </View>
    );
  };

  const renderStatusFinished = () => {
    return (
      <View style={styles.wrapperFinding}>
        <View style={styles.rowTopWaiting}>
          <Icons.Checking />
          <CommonText text="Đã thực hiện xong" styles={styles.textWaiting} />
        </View>
        <View style={styles.line} />

        <ItemMaker
          name={informationShoeMaker?.fullName ?? ''}
          phoneNumber={informationShoeMaker?.phone ?? ''}
          avatar={informationShoeMaker?.avatar ?? ''}
        />
        <View style={styles.line} />

        <View style={[styles.rowTypeCash, styles.mb16]}>
          <CommonText
            text={renderTypePayment(paymentMethod)}
            styles={styles.cash}
          />
          <CommonText
            text={`${formatCurrency(total)}đ`}
            styles={styles.total}
          />
        </View>

        <CommonButton
          text="Đánh giá dịch vụ"
          buttonStyles={styles.btRate}
          onPress={onPressRate}
        />
      </View>
    );
  };

  switch (status) {
    case StatusActivity.SEARCHING:
      return renderStatusFinding();
    case StatusActivity.NOT_FOUND:
      return renderStatusNotFinding();
    case StatusActivity.WAITING:
    case StatusActivity.ACCEPTED:
      return renderStatusWaiting();
    case StatusActivity.INPROGRESS:
    case StatusActivity.MEETING:
      return renderStatusProcessing();
    case StatusActivity.COMPLETED:
      return renderStatusFinished();
    default:
      return null;
  }
};

export default StatusOrder;
