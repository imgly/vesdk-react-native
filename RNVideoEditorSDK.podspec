require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = 'RNVideoEditorSDK'
  s.version      = package['version']
  s.summary      = package['description']
  s.description  = package['description']
  s.homepage     = package['homepage']
  s.license      = { :type => package['license'], :file => package['licenseFilename'] }
  s.author       = { package['author']['name'] => package['author']['email'] }
  s.platform     = :ios, '13.0'
  s.source       = { :git => package['repository']['url'], :tag => "#{s.version}" }
  s.source_files = 'ios/**/*.{h,m,swift}'
  s.public_header_files = ['ios/RNVideoEditorSDK.h', 'ios/RNImglyKit.h']
  s.requires_arc = true

  s.dependency 'React'
  s.dependency 'React-RCTImage'
  s.dependency 'VideoEditorSDK', '~> 11.3'
end
