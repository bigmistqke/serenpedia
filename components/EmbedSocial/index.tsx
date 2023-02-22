export default ({ hidden }: { hidden: boolean }) => {
  console.log('embedsocial', hidden)

  return (
    <div
      style={{
        visibility: hidden ? 'hidden' : 'visible',
        position: 'absolute',
      }}
      className="embedsocial-forms-iframe"
      data-ref="88a660458a1fd533220c5fc3e64844a0bd6bbbc9"
      data-widget="true"
      data-height="auto"
    />
  )
}
