import Script from 'next/script'

export default ({ hidden }: { hidden: boolean }) => {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          visibility: hidden ? 'hidden' : 'visible',
        }}
        className="embedsocial-forms-iframe"
        data-ref="88a660458a1fd533220c5fc3e64844a0bd6bbbc9"
        data-widget="true"
        data-height="auto"
      />
      <Script src="https://embedsocial.com/cdn/ef.js" />
    </>
  )
}
