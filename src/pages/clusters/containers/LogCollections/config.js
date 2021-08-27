import { get } from 'lodash'
import { ReactComponent as ESICON } from 'assets/es.svg'
import { ReactComponent as KaFkaICON } from 'assets/kafka.svg'
import { ReactComponent as FluentdICON } from 'assets/fluentd.svg'

import ESForm from 'components/Forms/Elasticsearch/Settings'
import KafkaForm from 'components/Forms/KafkaForm/Settings'
import FluentdForm from 'components/Forms/Fluentd/Settings'

const kafkaPathGetter = collection => get(collection, 'Brokers')
const pathGetter = collection =>
  `${get(collection, 'Host')}:${get(collection, 'Port')}`

export default {
  es: {
    ICON: ESICON,
    title: 'Elasticsearch',
    pathGetter,
    Form: ESForm,
    get description() {
      return t('ES_DESC')
    },
  },
  kafka: {
    ICON: KaFkaICON,
    title: 'Kafka',
    pathGetter: kafkaPathGetter,
    Form: KafkaForm,
    get description() {
      return t('KAFKA_DESC')
    },
  },
  forward: {
    ICON: FluentdICON,
    title: 'Fluentd',
    pathGetter,
    Form: FluentdForm,
    get description() {
      return t('FLUENTD_DESC')
    },
  },
}
